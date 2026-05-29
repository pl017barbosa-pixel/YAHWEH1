<?php
session_start();
include 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode(["status" => "error"]);
    exit;
}

// guardar email
$_SESSION['email'] = $email;

// 🔥 REGRA FIXA DE ADMIN (FORÇADA)
if ($email === "pl017@gmail.com") {
    $_SESSION['role'] = "admin";
} else {
    $_SESSION['role'] = "user";
}

echo json_encode([
    "status" => "ok",
    "role" => $_SESSION['role']
]);
?>
