<?php 
	/*$fontListArray = scandir("./css/fonts/");
	print_r($fontListArray[3]);*/
	
	$fontList = glob("./css/fonts/*.ttf");
	$tmp = array();
	foreach ($fontList as $key) {
		array_push($tmp, basename($key, ".ttf"));
	}
	print_r(json_encode($tmp));
?>