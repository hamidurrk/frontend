import Modal from "react-modal";
import "../styles/BreakDown.css";
import { Card, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";

const BreakDown = ({ isOpen, onClose, problemData }) => {
  const apiResCollectionRef = collection(db, "apiResponses");
  const [latestEntry, setLatestEntry] = useState(null);

  const getLatestEntryFromApiResCollection = async () => {
    try {
      const q = query(apiResCollectionRef, orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(q);
      const rawData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(rawData);
      // const parsedOuterJSON = JSON.parse(rawData);

      // // Step 2: Parse the "data" property
      // const innerJSONString = parsedOuterJSON.data;
      // const parsedInnerJSON = JSON.parse(innerJSONString);

      // // Now you can access properties of the inner JSON
      // console.log(parsedInnerJSON.raw_ocr_output_code);
      // console.log(parsedInnerJSON.encoded_image_with_boudning_boxes);

      if (!querySnapshot.empty) {
        const latestEntryData = querySnapshot.docs[0].data();
        console.log("Latest entry from otherCollection:", latestEntryData);
        console.log(latestEntryData.final_code);

        // Check if data property exists before parsing
        if (latestEntryData) {
          setLatestEntry(latestEntryData);
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
      getLatestEntryFromApiResCollection();
    }
  }, [isOpen]);

  const cardsData = [
    {
      title: "Raw OCR Output Code",
      content:"",
    },
    {
      title: "Encoded Image with Bounding Boxes",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      title: "Delta Graph JSON",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      title: "Indentation Graph JSON",
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      title: "IR Algorithm Output Code",
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      title: "Final Code",
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Problem Modal"
    >
      {/* <h2>Problem</h2>
      <p>{problemData}</p>
      {latestEntry && (
        <div>
          <h3>Latest Entry</h3>
          <pre>{JSON.stringify(latestEntry, null, 2)}</pre>
        </div>
      )} */}

      <Row className="justify-content-center">
        {cardsData.map((card, index) => (
          <Col key={index} md={1}>
            <Card>
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.content}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

export default BreakDown;
