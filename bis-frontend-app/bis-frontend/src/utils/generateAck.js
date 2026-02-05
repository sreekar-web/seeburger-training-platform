export function generateAck({
    partner,
    docType,
    validationErrors,
    success
}) {
    const ack = {
        ackCode: success ? "997" : "999",
        ak1: {
            functionalId: docType,
            partner
        },
        ak2: {
            transactionSet: docType,
            status: success ? "A" : "R"
        },
        ak3: [],
        ak4: []
    };

    if (!success && validationErrors?.length) {
        validationErrors.forEach((err) => {
            // AK3: segment error
            ack.ak3.push({
                segmentId: err.segment || "PO1",
                errorCode: err.code
            });

            // AK4: element error (if applicable)
            if (err.element) {
                ack.ak4.push({
                    elementId: err.element,
                    errorCode: err.code,
                    message: err.message
                });
            }
        });
    }

    return ack;
}
