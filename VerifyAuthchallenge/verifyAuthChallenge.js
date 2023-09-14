import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA6FMCIIJV2M5A7NRD",
  secretAccessKey: "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",
});

const { CognitoIdentityServiceProvider } = AWS;

exports.handler = async (event, context) => {
  try {
    console.log("I'm verify auth challenge. I'm triggered");
    const cognito = new CognitoIdentityServiceProvider();

    // Extract necessary information from the event (e.g., username, challenge name, challenge response)
    const { username, challengeName, challengeResponse } = JSON.parse(event.body);

    // Verify the authentication challenge response using the Cognito API
    await cognito.respondToAuthChallenge({
      ChallengeName: challengeName,
      ClientId: 'n4p4i5mfkuro0kd1es3aupmjp', // Specify the Cognito User Pool Client ID
      ChallengeResponses: {
        USERNAME: username,
        SECRET_HASH: 'my-secret-poc-hash', // Optional if using a client secret
        // Add other challenge responses as needed
        // For example, PASSWORD: 'user_password'
      },
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: 'Authentication challenge verified successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: 'Error verifying authentication challenge' }),
      err: error.toString()
    };
  }
};
