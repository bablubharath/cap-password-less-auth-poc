import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA6FMCIIJV2M5A7NRD",
  secretAccessKey: "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",
});

const { CognitoIdentityServiceProvider } = AWS;

exports.handler = async (event, context) => {
  try {
    console.log("I'm define auth challenge. I'm triggered");
    const cognito = new CognitoIdentityServiceProvider();

    // Ensure the request body is not null or empty
    if (!event.body) {
      throw new Error("Request body is missing or empty.");
    }

    // Extract necessary information from the event (e.g., username, challenge name)
    const { username, challengeName } = JSON.parse(event.body);

    // Define the authentication challenge using the Cognito API
    await cognito
      .adminSetUserSettings({
        UserPoolId: "us-east-1_8jKUxN1WC",
        Username: username,
        MFAOptions: [
          {
            ChallengeName: challengeName,
            Enabled: true, // You can adjust this based on your requirements
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Authentication challenge defined successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Error defining authentication challenge",
        err: error.toString(),
      }),
    };
  }
};
