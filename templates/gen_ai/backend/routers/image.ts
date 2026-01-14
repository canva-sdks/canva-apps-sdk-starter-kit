/**
 * DISCLAIMER:
 * This file contains a demonstration of how to implement a simple API with Express.js for educational purposes only.
 * It is NOT SUITABLE for use in a production environment. It lacks many essential features such as error handling,
 * input validation, authentication, and security measures. Additionally, the in-memory job queue is for illustrative
 * purposes only and is not efficient or scalable. For production use, consider using robust libraries and frameworks,
 * implementing proper error handling, security measures, and using appropriate database and job queue solutions.
 * Use this code as a learning resource, but do not deploy it in a real backend without significant modifications
 * to ensure reliability, security, and scalability.
 */
import express from "express";

interface ImageResponse {
  fullsize: { width: number; height: number; url: string };
  thumbnail: { width: number; height: number; url: string };
}

// Array of placeholder image URLs.
// In a real-world scenario, these URLs would point to dynamically generated images.
const imageUrls: ImageResponse[] = [
  {
    fullsize: {
      width: 1280,
      height: 853,
      url: "https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=1280&h=853&dpr=2",
    },
    thumbnail: {
      width: 640,
      height: 427,
      url: "https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=2",
    },
  },
  {
    fullsize: {
      width: 1280,
      height: 853,
      url: "https://images.pexels.com/photos/4010108/pexels-photo-4010108.jpeg?auto=compress&cs=tinysrgb&w=1280&h=863&dpr=2",
    },
    thumbnail: {
      width: 640,
      height: 427,
      url: "https://images.pexels.com/photos/4010108/pexels-photo-4010108.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=2",
    },
  },
  {
    fullsize: {
      width: 1280,
      height: 853,
      url: "https://images.pexels.com/photos/1327496/pexels-photo-1327496.jpeg?auto=compress&cs=tinysrgb&w=1280&h=853&dpr=2",
    },
    thumbnail: {
      width: 640,
      height: 427,
      url: "https://images.pexels.com/photos/1327496/pexels-photo-1327496.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=2",
    },
  },
  {
    fullsize: {
      width: 1280,
      height: 853,
      url: "https://images.pexels.com/photos/4693135/pexels-photo-4693135.jpeg?auto=compress&cs=tinysrgb&w=1280&h=853&dpr=2",
    },
    thumbnail: {
      width: 640,
      height: 427,
      url: "https://images.pexels.com/photos/4693135/pexels-photo-4693135.jpeg?auto=compress&cs=tinysrgb&w=640&h=427&dpr=2",
    },
  },
];

export const createImageRouter = () => {
  const enum Routes {
    CREDITS = "/api/credits",
    PURCHASE_CREDITS = "/api/purchase-credits",
    QUEUE_IMAGE_GENERATION = "/api/queue-image-generation",
    JOB_STATUS = "/api/job-status",
    CANCEL_JOB = "/api/job-status/cancel",
  }

  const router = express.Router();
  const jobQueue: {
    jobId: string;
    prompt: string;
    timeoutId: NodeJS.Timeout;
  }[] = [];
  const completedJobs: Record<string, ImageResponse[]> = {};
  const cancelledJobs: { jobId: string }[] = [];

  // Initial credit allocation for users, which decreases with each use.
  // Users receive 10 credits initially and can purchase additional credits in bundles.
  let credits = 10;
  const CREDITS_IN_BUNDLE = 10;

  /**
   * GET endpoint to retrieve user credits.
   * Returns the current number of credits available to the user.
   */
  router.get(Routes.CREDITS, async (req, res) => {
    res.status(200).send({
      credits,
    });
  });

  /**
   * POST endpoint to purchase credits.
   * Increments the user's credits by the number of credits in a bundle.
   * This endpoint should be backed by proper input validation to prevent misuse.
   */
  router.post(Routes.PURCHASE_CREDITS, async (req, res) => {
    credits += CREDITS_IN_BUNDLE;
    res.status(200).send({
      credits,
    });
  });

  /**
   * GET endpoint to generate images based on a prompt.
   * Generates images based on the provided prompt and adds a job to the processing queue.
   * If there are not enough credits, it returns a 403 error.
   * If the prompt parameter is missing, it returns a 400 error.
   * Once the job is added to the queue, it returns a jobId that can be used to check the job status.
   * Note: The job processing time is simulated to be 5 seconds.
   */
  router.get(Routes.QUEUE_IMAGE_GENERATION, async (req, res) => {
    if (credits <= 0) {
      return res
        .status(403)
        .send("Not enough credits required to generate images.");
    }

    const prompt = req.query.prompt as string;
    if (!prompt) {
      return res.status(400).send("Missing prompt parameter.");
    }

    const jobId = generateJobId();

    const timeoutId = setTimeout(() => {
      const index = jobQueue.findIndex((job) => job.jobId === jobId);
      if (index !== -1) {
        jobQueue.splice(index, 1);
        completedJobs[jobId] = imageUrls.map((image) => {
          return { ...image, label: prompt };
        });

        // Reduce credits by 1 when images are successfully generated
        credits -= 1;
      }
    }, 5000); // Simulating 5 seconds processing time

    // Add the job to the jobQueue along with the timeoutId
    jobQueue.push({ jobId, prompt, timeoutId });

    return res.status(200).send({
      jobId,
    });
  });

  /**
   * GET endpoint to check the status of a job.
   * Retrieves the status of a job identified by its jobId parameter.
   * If the job is completed, it returns the images generated by the job.
   * If the job is still in the processing queue, it returns "processing".
   * If the job has been cancelled, it returns "cancelled".
   * If the job is not found, it returns a 404 error.
   */
  router.get(Routes.JOB_STATUS, async (req, res) => {
    const jobId = req.query.jobId as string;

    if (!jobId) {
      return res.status(400).send("Missing jobId parameter.");
    }

    if (completedJobs[jobId]) {
      return res.status(200).send({
        status: "completed",
        images: completedJobs[jobId],
        credits,
      });
    }

    if (jobQueue.some((job) => job.jobId === jobId)) {
      return res.status(200).send({
        status: "processing",
      });
    }

    if (cancelledJobs.some((job) => job.jobId === jobId)) {
      return res.status(200).send({
        status: "cancelled",
      });
    }

    return res.status(404).send("Job not found.");
  });

  /**
   * POST endpoint to cancel a job.
   * Cancels a job identified by its jobId parameter.
   * If the job is found and successfully cancelled, it removes the job from the processing queue and adds it to the cancelled jobs array.
   * If the job is not found, it returns a 404 error.
   */
  router.post(Routes.CANCEL_JOB, async (req, res) => {
    const jobId = req.query.jobId as string;

    if (!jobId) {
      return res.status(400).send("Missing jobId parameter.");
    }

    const index = jobQueue.findIndex((job) => job.jobId === jobId);
    const job = jobQueue[index];
    if (index !== -1 && job) {
      cancelledJobs.push({ jobId });
      // If the job is found, remove it from the jobQueue
      jobQueue.splice(index, 1);
      // Also clear the timeout associated with this job if it exists
      clearTimeout(job.timeoutId);
      return res.status(200).send("Job successfully cancelled.");
    }

    return res.status(404).send("Job not found.");
  });

  /**
   * Generates a unique job ID.
   */
  function generateJobId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  return router;
};
