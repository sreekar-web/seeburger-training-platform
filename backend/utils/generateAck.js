// backend/utils/generateAck.js

export function generateAck(message, validationResult, mappingResult) {
    // Default to success
    let ackCode = "997";
    let ackMessage = "Accepted";

    // Validation errors → reject
    if (!validationResult.isValid) {
        ackCode = "999";
        ackMessage = "Rejected due to validation errors";
    }

    // Mapping runtime errors → reject
    if (mappingResult && mappingResult.runtimeErrors?.length > 0) {
        ackCode = "999";
        ackMessage = "Rejected due to mapping errors";
    }

    return {
        ackCode,
        ackMessage,
        timestamp: new Date().toISOString()
    };
}
