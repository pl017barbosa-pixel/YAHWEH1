<?php
session_start();
header('Content-Type: application/json');

include 'config.php';

// 🔐 PROTEÇÃO ADMIN
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Acesso negado'
    ]);
    exit;
}

// 📊 QUERY SEGURA
$result = $conn->query("SELECT COUNT(*) as total FROM users");

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro na base de dados'
    ]);
    exit;
}

$row = $result->fetch_assoc();

// ✅ RESPOSTA FINAL
echo json_encode([
    'total' => (int)$row['total']
]);
?>
