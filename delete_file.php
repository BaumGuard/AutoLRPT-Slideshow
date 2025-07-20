<?php
include 'images_directory.php';

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    // Get the raw POST data
    $postData = file_get_contents( 'php://input' );
    $data = json_decode( $postData, true );

    if ( isset($data['deleteFile']) ) {
        $deleteFile = $data['deleteFile'];

        if ( file_exists($deleteFile) ) {
			$uncompressedFile = str_replace( "/compressed", "", $deleteFile );
            if ( unlink($deleteFile) && unlink($uncompressedFile) ) {
                echo json_encode( ["message" => "File '$deleteFile' has been deleted."] );
            } else {
                echo json_encode( ["error" => "Error deleting the file '$uncompressedFile'."] );
            }
        } else {
            echo json_encode( ["error" => "File '$deleteFile' does not exist."] );
        }
    } else {
        echo json_encode( ["error" => "No file specified."] );
    }
} else {
    echo json_encode( ["error" => "Invalid request method."] );
}
?>
