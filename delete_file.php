<?php
include 'images_directory.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);

    if (isset($data['deleteFile'])) {
        $deleteFile = $data['deleteFile'];

        if (file_exists($deleteFile)) {
            if (unlink($deleteFile)) {
                echo json_encode(["message" => "File '$deleteFile' has been deleted."]);
            } else {
                echo json_encode(["error" => "Error deleting the file '$deleteFile'."]);
            }
        } else {
            echo json_encode(["error" => "File '$deleteFile' does not exist."]);
        }
    } else {
        echo json_encode(["error" => "No file specified."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>

