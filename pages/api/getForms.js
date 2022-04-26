import axios from "axios";

export default async function handler(req, res) {

    const { apiKey } = req?.query;

    // if method is GET request and we have access token
    if (req.method === "GET" && apiKey) {
      const { data } = await axios.get(
        `https://api.jotform.com/user/forms`,
        {
          headers: {
            Accept: "application/json",
            APIKEY: apiKey
          }
        }
      );
  
      res.status(200).json(data);
    } else {
      // Handle any other HTTP method
      res.status(500).json({
        success: 0,
        message: "Request method not supported.",
      });
    }
}
