import Modal from "react-modal";
import "../styles/BreakDown.css";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import Plot from "react-plotly.js";
// import data from "../test.json";

const BreakDown = ({ isOpen, onClose, parseddata }) => {
  const apiResCollectionRef = collection(db, "apiResponses");
  const [latestEntry, setLatestEntry] = useState(null);
  const [deltaGraphData, setDeltaGraphData] = useState(null);
  const [indGraphData, setIndGraphData] = useState(null);
  const [base64String, setBase64String] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLatestEntryFromApiResCollection = async () => {
    
    try {
      const q = query(apiResCollectionRef);
      const querySnapshot = await getDocs(q);
      const rawData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(rawData);

      if (!querySnapshot.empty) {
        const latestEntryData = querySnapshot.docs[0].data();
        console.log("Latest entry from otherCollection:", latestEntryData);
        console.log(latestEntryData.imgUrl);

        if (latestEntryData) {
            let apiResponse = await makeApiRequest(latestEntryData.imgUrl);
            console.log(apiResponse);
            const {raw_ocr_output_code, encoded_image_with_boudning_boxes, delta_graph_json, indentation_graph_json, ir_algo_output_code, final_code} = apiResponse;
            console.log(final_code);
            setData(apiResponse);
          setDeltaGraphData(apiResponse.delta_graph_json);
          setIndGraphData(apiResponse.indentation_graph_json);
          setBase64String(
            `data:image/png;base64,${apiResponse.encoded_image_with_boudning_boxes}`
          );
            
        } else {
          console.warn(
            "Data property not found in latest entry:",
            latestEntryData
          );
          setLatestEntry(null);
        }
      } else {
        console.log("No entries found in otherCollection.");
        setLatestEntry(null);
      }
    } catch (error) {
      console.error("Error getting latest entry from otherCollection:", error);
      setLatestEntry(null);
    } finally {
        setLoading(false); // Set loading to false when data fetch completes
      }
  };
  async function makeApiRequest(imageUrl) {
    const apiUrl = 'http://13.59.173.12:8000/gaussian_extraction'; 

    try {
        const response = await fetch(apiUrl + '?image_url=' + encodeURIComponent(imageUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // If the response status code is not OK, throw an error with the status
            const errorInfo = await response.json();
            console.error('API request failed:', errorInfo);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // If the response is OK, parse and log the JSON body
        const responseData = await response.json();
        console.log('API request successful:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error during API request:', error);
    }
}


  useEffect(() => {
    if (isOpen) {
        try{
            getLatestEntryFromApiResCollection();

        } catch {

        }
    }
  }, [isOpen]);

//   const cardsData = [
//     {
//       title: "Raw OCR Output Code",
//       content: data.raw_ocr_output_code,
//     },
//     {
//       title: "Encoded Image with Bounding Boxes",
//       content: data.encoded_image_with_boudning_boxes,
//     },
//     {
//       title: "Delta Graph JSON",
//       content: data.delta_graph_json,
//     },
//     {
//       title: "Indentation Graph JSON",
//       content: data.indentation_graph_json,
//     },
//     {
//       title: "IR Algorithm Output Code",
//       content: data.ir_algo_name,
//     },
//     {
//       title: "Final Code",
//       content: data.final_code,
//     },
//   ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Problem Modal"
    >
    <button className="close-button" onClick={onClose}>
      Close
    </button>
          {loading ? (
        // Render your loading animation here
        <h1>Loading...</h1>
      ) : (
        data && (  // Check if data is not null
      <Container>
        <Row>
          <Col>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>Raw OCR Output Code</Card.Title>
                <Card.Text>{data.raw_ocr_output_code}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8} md={4}>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>Encoded Image with Bounding Boxes</Card.Title>
                <Card.Text>
                  <img src={base64String} alt="Base64 Image" />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>Delta Graph JSON</Card.Title>
                <Card.Text>
                  {deltaGraphData && (
                    <Plot
                      data={deltaGraphData.data}
                      layout={deltaGraphData.layout}
                    />
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>Indentation Graph JSON</Card.Title>
                <Card.Text>
                  {indGraphData && (
                    <Plot
                      data={indGraphData.data}
                      layout={indGraphData.layout}
                    />
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>IR Algorithm Output Code</Card.Title>
                <Card.Text>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {data.ir_algo_output_code}
                  </pre>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <Card.Title>Final Code</Card.Title>
                <Card.Text>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {data.final_code}
                  </pre>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
        )
    )}
    </Modal>
  );
};

export default BreakDown;
