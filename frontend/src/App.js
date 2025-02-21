import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const App = () => {
  const sigCanvas = useRef();
  const [signatureData, setSignatureData] = useState('');

  // Function to clear the canvas
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  // Function to save the signature
  const saveSignature = () => {
    const dataUrl = sigCanvas.current.toDataURL(); // Base64 image of the signature
    setSignatureData(dataUrl); // Save the signature data URL
    sendSignatureToBackend(dataUrl); // Send it to the backend
  };

  // Function to send signature to the backend (Python)
  const sendSignatureToBackend = (signatureData) => {
    fetch('http://localhost:5000/save-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signature: signatureData }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <h3>Sign Here</h3>
      <SignatureCanvas
        ref={sigCanvas}
        backgroundColor="white"
        penColor="black"
        canvasProps={{ width: 500, height: 200 ,className: 'signatureCanvas' , style: {
          border: '2px solid black', // Add border here
          borderRadius: '5px', // Optional: for rounded corners
        },}}
      />
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save Signature</button>
      {signatureData && (
        <div>
          <h4>Signature Data (Base64):</h4>
          <img src={signatureData} alt="Signature" />
        </div>
      )}
    </div>
  );
};

export default App;
