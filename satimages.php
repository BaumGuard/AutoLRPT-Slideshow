<?php
	include 'images_directory.php';

	header("Content-Type: application/json");

	$image_paths = glob($images_directory."*.jpg");

	echo json_encode([
		"files" => $image_paths
	]);
?>
