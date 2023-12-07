import Modal from "react-modal";
import "../styles/BreakDown.css";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import Plot from "react-plotly.js";
import data from "../test.json";

const BreakDown = ({ isOpen, onClose, problemData }) => {
  const apiResCollectionRef = collection(db, "apiResponses");
  const [latestEntry, setLatestEntry] = useState(null);
  const [deltaGraphData, setDeltaGraphData] = useState(null);
  const [indGraphData, setIndGraphData] = useState(null);
  const [base64String, setBase64String] = useState("");
  const [data, setData] = useState(null);

  const getLatestEntryFromApiResCollection = async () => {
    console.log(data.final_code);
    setDeltaGraphData(data.delta_graph_json);
    setIndGraphData(data.indentation_graph_json);
    setBase64String(
      `data:image/png;base64,${data.encoded_image_with_boudning_boxes}`
    );
    ////////////////////////////////////////////////////////////
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
        console.log(latestEntryData.data);

        // Check if data property exists before parsing
        if (latestEntryData) {
            const extractedData = JSON.parse(latestEntryData.data);
            setLatestEntry(extractedData);
            console.log("Extracted data:", extractedData);
            setDeltaGraphData(extractedData.delta_graph_json);
            setIndGraphData(extractedData.indentation_graph_json);
            setBase64String(
            `data:image/png;base64,${extractedData.encoded_image_with_boudning_boxes}`
            );
            setData(extractedData)
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
    }
  };

  useEffect(() => {
    if (isOpen) {
        try{
            getLatestEntryFromApiResCollection();

        } catch {

        }
    }
  }, [isOpen]);

  const cardsData = [
    {
      title: "Raw OCR Output Code",
      content: data.raw_ocr_output_code,
    },
    // {
    //   title: "Encoded Image with Bounding Boxes",
    //   content: data.encoded_image_with_boudning_boxes,
    // },
    // {
    //   title: "Delta Graph JSON",
    //   content: data.delta_graph_json,
    // },
    // {
    //   title: "Indentation Graph JSON",
    //   content: data.indentation_graph_json,
    // },
    {
      title: "IR Algorithm Output Code",
      content: data.ir_algo_name,
    },
    {
      title: "Final Code",
      content: data.final_code,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Problem Modal"
    >
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
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

export default BreakDown;
