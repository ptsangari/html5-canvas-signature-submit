<?php
if (isset($_POST['signatureInput'])) {
    // Get the base64 encoded string
    $signatureData = $_POST['signatureInput'];

    // Remove the data:image/png;base64, part
    $signatureData = str_replace('data:image/png;base64,', '', $signatureData);
    $signatureData = str_replace(' ', '+', $signatureData);

    // Decode the base64 string
    $signatureImage = base64_decode($signatureData);

    // Specify the path where the image will be saved
    $filePath = 'signatures/signature_' . time() . '.png';

    // Save the image to the server
    file_put_contents($filePath, $signatureImage);

    // Send the image via email
    $to = 'recipient@example.com';
    $subject = 'New Signature Submission';
    $message = 'A new signature has been submitted.';
    $headers = 'From: sender@example.com';

    // Read the file content for attachment
    $fileContent = chunk_split(base64_encode(file_get_contents($filePath)));

    // Define the boundary
    $boundary = md5(time());

    // Define the headers for attachment
    $headers .= "\r\nMIME-Version: 1.0\r\n" .
                "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";

    // Define the message with attachment
    $body = "--{$boundary}\r\n" .
            "Content-Type: text/plain; charset=\"UTF-8\"\r\n" .
            "Content-Transfer-Encoding: 7bit\r\n\r\n" .
            "{$message}\r\n\r\n" .
            "--{$boundary}\r\n" .
            "Content-Type: image/png; name=\"signature.png\"\r\n" .
            "Content-Disposition: attachment; filename=\"signature.png\"\r\n" .
            "Content-Transfer-Encoding: base64\r\n\r\n" .
            "{$fileContent}\r\n\r\n" .
            "--{$boundary}--";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo 'Email sent successfully.';
    } else {
        echo 'Failed to send email.';
    }

    echo 'Signature saved as ' . $filePath;
} else {
    echo 'No signature data received.';
}
?>
