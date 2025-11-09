<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Adicionar Nova Comic</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    body { background: #181818; color: #fff; font-family: sans-serif; }
    .admin-form { max-width: 420px; margin: 2rem auto; background: #222; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 16px #0006; }
    label { display: block; margin-top: 1rem; }
    input, select { width: 100%; margin-top: 0.5rem; padding: 0.5rem; border-radius: 8px; border: none; }
    button { margin-top: 1.5rem; padding: 0.7rem 1.2rem; border-radius: 8px; border: none; background: #0a7; color: #fff; font-weight: bold; cursor: pointer; }
    .msg { margin-top: 1rem; color: #0a7; }
  </style>
</head>./PHP-8.4.14/php.exe -S localhost:8000
<body>
  <div class="admin-form">
    <h2>Adicionar Nova Comic</h2>
    <form action="admin_upload.php" method="post" enctype="multipart/form-data">
      <label>Nome da Comic
        <input type="text" name="comic_name" required placeholder="Ex: Sand" />
      </label>
      <label>Thumbnail (imagem de capa)
        <input type="file" name="thumbnail" accept="image/*" required />
      </label>
      <label>Música (opcional)
        <input type="file" name="music" accept="audio/*" />
      </label>
      <label>Vídeos das páginas (Frame 1, Frame 2...)
        <input type="file" name="frames[]" accept="video/*" multiple required />
      </label>
      <button type="submit">Enviar e Criar Comic</button>
    </form>
    <hr style="margin:2rem 0; border:none; border-top:1px solid #333;">
    <h2>Adicionar Página a Comic Existente</h2>
    <form action="admin_add_page.php" method="post" enctype="multipart/form-data">
      <label>Escolha a Comic
        <select name="comic_folder" required>
          <?php
          $comics = glob(__DIR__ . '/assets/comics/*', GLOB_ONLYDIR);
          // DEBUG: Exibir resultado do glob
          echo '<div style="color:yellow; background:#333; padding:8px; margin:8px 0; font-size:0.9em;">DEBUG: Encontrado: <pre>';
          print_r($comics);
          echo '</pre></div>';
          if ($comics && count($comics) > 0) {
            foreach ($comics as $comic) {
              $name = basename($comic);
              echo "<option value='" . htmlspecialchars($name) . "'>" . htmlspecialchars($name) . "</option>";
            }
          } else {
            echo "<option value='' disabled>Nenhuma comic encontrada</option>";
          }
          ?>
        </select>
      </label>
      <label>Vídeo da nova página
        <input type="file" name="frame" accept="video/*" required />
      </label>
      <button type="submit">Adicionar Página</button>
    </form>
    <div class="msg">
      <!-- Mensagem de sucesso/erro aparece aqui -->
    </div>
  </div>
</body>
</html>
