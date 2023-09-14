import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA6FMCIIJV2M5A7NRD",
  secretAccessKey: "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",
});

const { CognitoIdentityServiceProvider } = AWS;

exports.handler = async (event, context) => {
  try {
    console.log("I'm create auth challenge. I'm triggered");
    const cognito = new CognitoIdentityServiceProvider();

    // Extract necessary information from the event (e.g., username, challenge parameters)
    const { username, challengeParams } = JSON.parse(event.body);

    // Create the authentication challenge using the Cognito API
    await cognito
      .adminCreateUserChallenge({
        ChallengeName: "CUSTOM_CHALLENGE", // Adjust based on your challenge type
        UserPoolId: "us-east-1_BX3K4WE2a",
        Username: username,
        ChallengeResponses: challengeParams,
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: "Authentication challenge created successfully",
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
        message: "Error creating authentication challenge",
        err: error.toString(),
      }),
    };
  }
};
