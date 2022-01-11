import moment from "moment";
import schedule, { rescheduleJob } from "node-schedule";
import AutoBiddingJobModel from "../models/AutoBiddingJobModel.js";
import ProductDetailModel from "../models/ProductDetailModel.js";
import ProductModel from "../models/ProductModal.js";
import UserAccountModel from "../models/UserAccountModel.js";
import EmailService from "../services/EmailService.js";
import EmailTemplate from "../shared/template/EmailTemplate.js";

class ScheduleJobEvent {
    _scheduleJobs;
    constructor() {
        this._scheduler = schedule;
        this._scheduleJobs = {};
    }

    // TODO: Edit is_sold field in the product table.
    subscribeNewJob(jobId, startDate) {
        this._scheduleJobs[jobId] = this._scheduler.scheduleJob(
            startDate,
            async function (id) {
                console.log(`>>> JOB START: JOB_ID ${id} ${new Date()}`);
                const [job] = await AutoBiddingJobModel.getByJobId(id);
                if (!job) {
                    console.log(`>>> JOB_ID ${id} - NOT FOUND`);
                    return;
                }
                const [product] = await ProductModel.getById(job.product_id);
                const [detail] = await ProductDetailModel.getlById(job.product_id);

                if (!product || !detail) {
                    console.log(`>>> JOB_ID ${id} - PRODUCT NOT FOUND`);
                    return;
                }

                if (product.won_bidder_id) {
                    ProductModel.update(product.product_id, {
                        is_sold: 1,
                    }).catch((error) => {
                        console.log(error);
                    });

                    UserAccountModel.getByColumn("user_id", product.won_bidder_id).then((res) => {
                        const [bidder] = res;
                        if (bidder) {
                            console.log(`>>> JOB SEND WINNER: JOB_ID ${id} - ${new Date()}`);
                            EmailService.sendEmailWithHTMLContent(
                                bidder.email,
                                "Bidding result - You have won a product",
                                EmailTemplate.biddingResultBidder(
                                    product.product_name,
                                    product.current_price
                                )
                            ).catch((error) => {
                                console.log(error);
                            });
                        }
                    });

                    UserAccountModel.getByColumn("user_id", detail.seller_id).then((sellerList) => {
                        const [seller] = sellerList;
                        if (seller) {
                            console.log(`>>> JOB SEND SELLER: JOB_ID ${id} - ${new Date()}`);
                            EmailService.sendEmailWithHTMLContent(
                                seller.email,
                                "Bidding result - The product you are posting has been sold",
                                EmailTemplate.bidResultSeller(
                                    product.product_name,
                                    product.current_price
                                )
                            ).catch((error) => {
                                console.log(error);
                            });
                        }
                    });
                } else {
                    UserAccountModel.getByColumn("user_id", detail.seller_id).then((sellerList) => {
                        const [seller] = sellerList;
                        if (seller) {
                            console.log(
                                `>>> JOB SEND SELLER - NO WINNER: JOB_ID ${id} - ${new Date()}`
                            );
                            EmailService.sendEmailWithHTMLContent(
                                seller.email,
                                "Bidding result - Time for your bidding product has been expired",
                                EmailTemplate.noResultSeller(product.product_name)
                            ).catch((error) => {
                                console.log(error);
                            });
                        }
                    });
                }

                await AutoBiddingJobModel.delete(job.job_id);

                // If job run successfully
                if (this._scheduleJobs[jobId]) {
                    delete this._scheduleJobs[id];
                }
                console.log(`>>> JOB END: JOB_ID ${id} - ${new Date()}`);
            }.bind(this, jobId)
        );
    }

    unSubscribeExistedJob(jobId) {
        if (this._scheduleJobs[jobId]) {
            console.log(`>>> RESCHEDULE JOB: JOB_ID ${jobId} - ${new Date()}`);
            this._scheduleJobs[jobId].cancel(false);
            delete this._scheduleJobs[jobId];
        }
    }

    reScheduleJob(jobId, newStartDate) {
        this.unSubscribeExistedJob(jobId);
        this.subscribeNewJob(jobId, newStartDate);
    }

    async runOldScheduledJob() {
        try {
            const jobList = await AutoBiddingJobModel.getAll();
            if (jobList && jobList.length > 0) {
                jobList.forEach((job) => {
                    if (moment().isAfter(moment(job.expired_date))) {
                        this.subscribeNewJob(job.job_id, moment().toDate());
                    } else {
                        this.subscribeNewJob(job.job_id, moment(job.expired_date).toDate());
                    }
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export const ScheduleJobEventInstance = new ScheduleJobEvent();
