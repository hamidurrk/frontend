import { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { imageDb } from "../firebase";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { Card, Form, Button, Image } from 'react-bootstrap';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { v4 } from "uuid";
// import { Form, Button, Card, Image } from 'react-bootstrap';

const ImageUpload = ({ isOpen, onClose, onImageUpload, onApiResponse }) => {
    // const [img,setImg] =useState('');
    // const cid = v4();
    const apiResCollectionRef = collection(db, "apiResponses");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     setSelectedImage(file);
    // };

    const handleUpload = () => {
        if (selectedImage) {
        // Perform image upload logic here
        onImageUpload(selectedImage);
        // Close the modal
        onClose();
        }
    };

    useEffect(() => {
        Modal.setAppElement('#wrapper'); 
      }, []);

    const handleFileChange = (event) => {
        try {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
          
            // Generate image preview
            const reader = new FileReader();
            
            reader.onloadend = () => {
              setImagePreview(reader.result);
            };
          
            reader.readAsDataURL(selectedFile);
          } catch (error) {
            console.error('Error handling file:', error);
            // Handle the error as needed, e.g., show an error message to the user
          }
        }

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
                  setLoading(false)
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
      
              // If the response is OK, parse and log the JSON body
              const responseData = await response.json();
              // console.log('API request successful:', responseData);
              return responseData;
      
          } catch (error) {
              console.error('Error during API request:', error);
          }
      }

      const deleteAllDocuments = async () => {
  
        try {
          // Get all documents in the collection
          const querySnapshot = await getDocs(apiResCollectionRef);
      
          // Delete each document
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Document with ID ${doc.id} deleted successfully.`);
          });
      
          console.log('All documents deleted successfully.');
        } catch (error) {
          console.error('Error deleting documents:', error);
        }
      };
      const addDataToApiResCollection = async (data) => {
        try {
          // const stringifiedData = JSON.stringify(data);
          // await addDoc(apiResCollectionRef, { data: stringifiedData });
          await addDoc(apiResCollectionRef, data)
          console.log('Data added to apiResonses successfully!');
        } catch (error) {
          console.error('Error adding data to apiResonses:', error);
        }
      };

    const uploadImageAndCheck = async () => {
      setLoading(true);
        const uploadTask = ref(imageDb, 'test-code/image');
        try {
          await uploadBytes(uploadTask, file);
      
          const url = await getDownloadURL(uploadTask);
            
          console.log(url);
      
          if (url === null) {
            uploadImageAndCheck();
          } else {
            console.log(url);
            const dataObject = {
              imgUrl: url
            }
            deleteAllDocuments().then(() => {
            addDataToApiResCollection(dataObject);
          })
            let apiResponse = await makeApiRequest(url);
            console.log(apiResponse);
            const {raw_ocr_output_code, encoded_image_with_boudning_boxes, delta_graph_json, indentation_graph_json, ir_algo_output_code, final_code} = apiResponse;
            console.log(final_code);
            onApiResponse(apiResponse);
            
            setLoading(false);
            onClose();
            toast.success('Image Uploaded Successfully');
          }
        } catch (error) {
          console.log('Error uploading image:', error);
        } finally {
        }
      };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Image Upload"
            >
            <h1 className="text-center my-4">Capture or Upload</h1>
          <Card className="p-4 shadow-lg">
            <Form>
              <Form.Group controlId="formFile">
                <Form.Label>Select an image </Form.Label>
                <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
              </Form.Group>
              {loading ? (
            <div className="my-4">
              <h3>Image Preview:</h3>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Uploaded"
                  fluid
                  rounded
                  className="border"
                  style={{ maxWidth: '100%', maxHeight: '425px', objectFit: 'contain' }}
                />
              )}
            </div>
          ) : null}
              <br/>
              <Button className="close-button" onClick={uploadImageAndCheck} >{loading ? 'Uploading...' : 'Upload'}</Button>
            </Form>
          </Card>

        </Modal>
        );
    }
         
export default ImageUpload;