<?php

session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: index.html");
    exit;

/* =========================
   📊 DADOS DO SISTEMA
========================= */

$total_membros = $conn->query("SELECT COUNT(*) as total FROM users")->fetch_assoc()['total'];

$total_doacoes = $conn->query("
    SELECT SUM(valor) as total FROM donations
")->fetch_assoc()['total'] ?? 0;

$query_users = $conn->query("
    SELECT u.email, p.nome_completo, u.data_criacao
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
");
?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Painel Admin - YAHWEH</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            font-family: 'Cinzel', serif;
            background: #0b0b0b;
            color: #fff;
            padding: 40px;
        }

        .card {
            background: #1a1a1a;
            padding: 25px;
            border: 1px solid #C8A96B;
            border-radius: 12px;
            flex: 1;
            text-align: center;
        }

        .card h3 {
            color: #C8A96B;
            font-size: 1.2rem;
        }

        .card p {
            font-size: 1.8rem;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: #131313;
            margin-top: 20px;
            color: #fff;
        }

        th, td {
            padding: 15px;
            border: 1px solid #333;
            text-align: left;
        }

        th {
            background: #C8A96B;
            color: #000;
        }
    </style>
</head>

<body>

    <div class="mb-4">
        <a href="index.html" class="btn btn-outline-light">← Voltar para o Início</a>
    </div>

    <h1>Painel de Administração</h1>

    <div class="alert alert-dark text-center mb-4"
         style="border: 1px solid #C8A96B; color: #C8A96B;">
        🔔 <strong>Notificação:</strong> Tens atualmente
        <span id="member-count"><strong><?php echo $total_membros; ?></strong></span>
        membros registados na comunidade.
    </div>

    <div class="d-flex gap-4 mb-5">
        <div class="card">
            <h3>Total de Membros</h3>
            <p><?php echo $total_membros; ?></p>
        </div>

        <div class="card">
            <h3>Total Arrecadado</h3>
            <p><?php echo number_format($total_doacoes, 2, ',', '.'); ?> €</p>
        </div>
    </div>

    <h2>Lista de Membros</h2>

    <table>
        <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Data de Registo</th>
        </tr>

        <?php while($row = $query_users->fetch_assoc()): ?>
        <tr>
            <td><?php echo $row['nome_completo'] ?: 'Sem nome'; ?></td>
            <td><?php echo $row['email']; ?></td>
            <td><?php echo $row['data_criacao']; ?></td>
        </tr>
        <?php endwhile; ?>
    </table>
     


<script>
async function verificarNovosMembros() {
    try {
        const response = await fetch('get_member_count.php');
        const data = await response.json();

        document.getElementById('member-count').innerHTML =
            `<strong>${data.total}</strong>`;
    } catch (e) {
        console.error("Erro ao carregar membros");
    }
}

// atualização automática
setInterval(verificarNovosMembros, 30000);
</script>


</body>
</html>
