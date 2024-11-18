<!DOCTYPE html>

<html>

<head>
	<title>LRPT images</title>

	<style>
		td, th {padding: 3px;}
		th {padding-right: 20px; text-align: left;}
		#slideshow-button {
			padding: 10px;
			font-size: 16pt;
		}
	</style>
</head>

<body>
	<h1>LRPT images from <span style="color:green">Meteor M2 3</span> and <span style="color:green">Meteor M2 4</span></h1>
	<button><a id="slideshow-button" href="slideshow.html">Images</a></button>

	<h2>Next pass</h2>
		<?php
			$pass_file = file('next_pass');
			$test_pass = $pass_file[0];
			$test_pass = str_getcsv($test_pass, ' ');
			
			echo "<table>";

			echo "<tr>";
			echo "<th>Date</th>";
			echo "<td>".$test_pass[0]."</td>";
			echo "</tr>";

			echo "<tr>";
			echo "<th>Time</th>";
			echo "<td>".$test_pass[1]."</td>";
			echo "</tr>";


			echo "<tr>";
			echo "<th>Satellite</th>";
			echo "<td>".$test_pass[2]."</td>";
			echo "</tr>";
			echo "</table>";
		?>

	<h2>Recent pass</h2>
		<?php
			$log_line = count(file("log.txt"));
			$log_file = file('log.txt');

			$rec_pass = $log_file[$log_line -1];
			$rec_pass = str_getcsv(preg_replace('/\s+/', ' ', $rec_pass), ' ');
			
			echo "<table>";

			echo "<tr>";
			echo "<th>Date</th>";
			echo "<td>".$rec_pass[0]."</td>";
			echo "</tr>";

			echo "<tr>";
			echo "<th>Time</th>";
			echo "<td>".$rec_pass[1]."</td>";
			echo "</tr>";


			echo "<tr>";
			echo "<th>Satellite</th>";
			echo "<td>".$rec_pass[2]."</td>";
			echo "</tr>";


			echo "<tr>";
			echo "<th>Elevation</th>";
			echo "<td>".$rec_pass[3]."</td>";
			echo "</tr>";


			echo "<tr>";
			echo "<th>Azimuth</th>";
			echo "<td>".$rec_pass[4]."</td>";
			echo "</tr>";


			echo "<tr>";
			echo "<th>Status</th>";
			echo "<td>".$rec_pass[5]."</td>";
			echo "</tr>";


			echo "</table>";
		?>
		
		<h2>Log</h2>

	

			<?php
				$dbconnect = mysqli_connect("localhost","autolrpt","br3zh1nsK","passes_db");
			?>
		
			<table class="log-table">
				<tr class="log-table">
					<th>Date and Time</th>
					<th>Satellite</th>
					<th>Max. elevation</th>
					<th>Azimuth</th>
					<th>Status</th>
				</tr>			

			<?php
				$query = mysqli_query($dbconnect, "SELECT pass_time, satellite, max_elevation, azimuth, status FROM passes ORDER BY pass_time DESC LIMIT 10");
echo "Moin";
				while ($row = mysqli_fetch_array($query)) {

					echo
							"<tr>
								<td>{$row['pass_time']}</td>
								<td>{$row['satellite']}</td>
								<td>{$row['max_elevation']}</td>
								<td>{$row['azimuth']}</td>
								<td>{$row['status']}</td>
							</tr>";
				}
			?>
		</table>

	<button style="padding: 15px; margin-top: 20px;"><a style="font-size: 15pt;" href="log.txt">View log</a></button>
</body>
</html>
