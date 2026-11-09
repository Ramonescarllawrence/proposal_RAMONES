<?php

$autoload = __DIR__ . '/../vendor/autoload.php';

echo "Public directory: " . __DIR__ . "<br>";
echo "Autoload path: " . $autoload . "<br>";

if (file_exists($autoload)) {
    echo "File exists: YES<br>";
} else {
    echo "File exists: NO<br>";
}

if (is_readable($autoload)) {
    echo "File readable: YES<br>";
} else {
    echo "File readable: NO<br>";
}

echo "Real path: " . (realpath($autoload) ?: "NOT FOUND");