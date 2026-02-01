import {
  getValueFor,
  incrementValueByOneFor,
  setExpirationFor,
  setValueFor,
} from "../upstash/upstash-redis";

const RATE_LIMIT_WINDOW = 24 * 60 * 60; // 24 hours in seconds
const FORM_SUBMIT_LIMIT = 5; // Maximum submit per IP per day
const THROTTLE_SECONDS = 60; // Minimum seconds between submissions

const RATE_LIMIT_KEY_PREFIX = "rate_limit";
const THROTTLE_KEY_PREFIX = "throttle";

interface RateLimitResult {
  success: boolean;
  error?: string;
}

const createRateLimitKey = (identifier: string) => {
  return `${RATE_LIMIT_KEY_PREFIX}:${identifier}`;
};

const createThrottleKey = (identifier: string) => {
  return `${THROTTLE_KEY_PREFIX}:${identifier}`;
};

const isBelowThrottleOfSecondsFor = async (identifier: string,): Promise<number | undefined> => {
  const throttleKey = createThrottleKey(identifier);
  const lastSubmission = await getValueFor<number>(throttleKey);

  if (lastSubmission) {
    const secondsSinceLastSubmission = Math.floor(
      (Date.now() - lastSubmission) / 1000,
    );

    if (secondsSinceLastSubmission < THROTTLE_SECONDS) {
      const remainingSeconds = THROTTLE_SECONDS - secondsSinceLastSubmission;
      return remainingSeconds;
    }
  }
};

const hasReachedFormSubmitLimit = async (
  identifier: string,
): Promise<boolean> => {
  const key = createRateLimitKey(identifier);
  const count = await getValueFor<number>(key);

  return count !== null && count >= FORM_SUBMIT_LIMIT;
}

const updateRateLimitCount = async (identifier: string): Promise<void> => {
  const key = createRateLimitKey(identifier);
  const count = await incrementValueByOneFor(key);

  if (count === 1) {
    await setExpirationFor(key, RATE_LIMIT_WINDOW);
  }
}

const updateThrottleTime = async (identifier: string): Promise<void> => {
  const throttleKey = createThrottleKey(identifier);
  await setValueFor(throttleKey, Date.now(), THROTTLE_SECONDS);
}   

export const checkRateLimitFor = async (
  identifier: string,
): Promise<RateLimitResult> => {
  try {
    const remainingSeconds = await isBelowThrottleOfSecondsFor(identifier)

    if (remainingSeconds) {
        return {
          success: false,
          error: `Please wait ${remainingSeconds} seconds before submitting again`,
        };
    }
    
    const hasReachedLimit = await hasReachedFormSubmitLimit(identifier);

    if (hasReachedLimit) {
      return {
        success: false,
        error: "Daily submmission limit reached. Please try again later.",
      };
    }

    return { success: true };
  } catch (error) {
    //gracefully allow on error, given upstash limits
    console.log("Rate limit check failed:", error);
    return { success: true };
  }
}

export const incrementRateLimit = async (identifier: string): Promise<void> => {
  try {
    updateRateLimitCount(identifier);
    updateThrottleTime(identifier);
  } catch (error) {
    //gracefully allow on error, given upstash limits
    console.log("Rate limit increment failed:", error);
  }
}
