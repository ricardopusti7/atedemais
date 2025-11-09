<?php
// Funções auxiliares
function get_next_frame($folder) {
  $files = glob($folder . '/Frame *.mp4');
  $max = 0;
  foreach ($files as $file) {
    if (preg_match('/Frame (\d+)\.mp4$/', $file, $m)) {
      $num = intval($m[1]);
      if ($num > $max) $max = $num;
    }
  }
  return $max + 1;
}

function slugify($text) {
  $text = strtolower(preg_replace('/[^\w]+/', '-', $text));
  return trim($text, '-');
}

// Processamento dos formulários
$base = __DIR__;
$msg = '';

// Processar formulário de adicionar página
if (isset($_FILES['frame'])) {
    $comic_folder = isset($_POST['comic_folder']) ? $_POST['comic_folder'] : '';
    if (!$comic_folder) {
        $msg = '<div class="msg error">Comic não selecionada.</div>';
    } else {
        $frames_dir = "$base/assets/comics/$comic_folder/";
        if (!is_dir($frames_dir)) {
            $msg = '<div class="msg error">Pasta da comic não encontrada.</div>';
        } else {
            $next_frame = get_next_frame($frames_dir);
            $frame_name = "Frame $next_frame.mp4";
            move_uploaded_file($_FILES['frame']['tmp_name'], $frames_dir . $frame_name);
            
            // Atualiza o catalog.js
            $catalog_path = "$base/js/catalog.js";
            $catalog = file_get_contents($catalog_path);

            // Atualizar a entrada existente ou criar nova
            $pages = [];
            foreach (glob($frames_dir . 'Frame *.mp4') as $f) {
                $pages[] = str_replace($base . '/', '', $f);
            }
            sort($pages, SORT_NATURAL);
            $pages_js = "[\n            '" . implode("',\n            '", $pages) . "'\n        ]";

            if (preg_match('/title:\s*[\'"]' . preg_quote($comic_folder, '/') . '[\'"].*?pages:\s*\[(.*?)\]/s', $catalog, $matches)) {
                // Comic existe, atualizar suas páginas
                $catalog = preg_replace(
                    '/title:\s*[\'"]' . preg_quote($comic_folder, '/') . '[\'"].*?pages:\s*\[(.*?)\]/s',
                    "title: '$comic_folder',\n        thumbnail: 'assets/thumbnails/$comic_folder.jpg',\n        pages: $pages_js",
                    $catalog
                );
            } else {
                // Comic não existe, criar nova entrada
                if (preg_match_all('/id:\s*(\d+)/', $catalog, $ids)) {
                    $max_id = max($ids[1]);
                    $new_id = $max_id + 1;
                } else {
                    $new_id = 1;
                }
                $new_entry = "    {\n        id: $new_id,\n        title: '$comic_folder',\n        thumbnail: 'assets/thumbnails/$comic_folder.jpg',\n        pages: $pages_js\n    },\n";
                $catalog = preg_replace('/const comics = \[/', "const comics = [\n$new_entry", $catalog);
            }
            file_put_contents($catalog_path, $catalog);
            
            $comic_dir_path = "assets/comics/$comic_folder/";
            $msg = '<div class="msg success">Página adicionada com sucesso à comic <b>' . htmlspecialchars($comic_folder) . '</b>!<br>Diretório: <code>' . $comic_dir_path . '</code></div>';
        }
    }
}

// Processar formulário de criar nova comic
if (isset($_POST['comic_name'])) {
    $comic_name = $_POST['comic_name'];
    $comic_slug = slugify($comic_name);
    
    $errors = [];
    if (!$comic_name) $errors[] = 'Nome da comic obrigatório.';
    if (!isset($_FILES['thumbnail'])) $errors[] = 'Thumbnail obrigatória.';
    if (!isset($_FILES['frames'])) $errors[] = 'Pelo menos um vídeo obrigatório.';
    
    if ($errors) {
        $msg = '<div class="msg error">' . implode('<br>', $errors) . '</div>';
    } else {
        // Salvar thumbnail
        $thumb_dir = "$base/assets/thumbnails/";
        $thumb_path = $thumb_dir . $comic_slug . '.jpg';
        move_uploaded_file($_FILES['thumbnail']['tmp_name'], $thumb_path);
        
        // Salvar música (se enviada)
        $music_file = '';
        if (isset($_FILES['music']) && $_FILES['music']['size'] > 0) {
            $music_dir = "$base/assets/music/";
            $music_ext = pathinfo($_FILES['music']['name'], PATHINFO_EXTENSION);
            $music_file = $comic_slug . '.' . $music_ext;
            move_uploaded_file($_FILES['music']['tmp_name'], $music_dir . $music_file);
        }
        
        // Salvar vídeos das páginas
        $frames_dir = "$base/assets/comics/$comic_slug/";
        if (!is_dir($frames_dir)) mkdir($frames_dir, 0777, true);
        
        foreach ($_FILES['frames']['tmp_name'] as $i => $tmp) {
            $frame_name = "Frame " . ($i+1) . ".mp4";
            move_uploaded_file($tmp, $frames_dir . $frame_name);
        }
        
        // Atualizar catalog.js
        $catalog_path = "$base/js/catalog.js";
        $catalog = file_get_contents($catalog_path);
        
        // Adicionar nova comic ao catálogo
        if (preg_match_all('/id:\s*(\d+)/', $catalog, $ids)) {
            $max_id = max($ids[1]);
            $new_id = $max_id + 1;
        } else {
            $new_id = 1;
        }
        
        $pages = [];
        foreach (glob($frames_dir . 'Frame *.mp4') as $f) {
            $pages[] = str_replace($base . '/', '', $f);
        }
        sort($pages, SORT_NATURAL);
        $pages_js = "[\n            '" . implode("',\n            '", $pages) . "'\n        ]";
        $new_entry = "    {\n        id: $new_id,\n        title: '$comic_name',\n        thumbnail: 'assets/thumbnails/$comic_slug.jpg',\n        pages: $pages_js\n    },\n";
        $catalog = preg_replace('/const comics = \[/', "const comics = [\n$new_entry", $catalog);
        file_put_contents($catalog_path, $catalog);
        
        $msg = '<div class="msg success">Comic adicionada com sucesso!<br>Volte à página principal para ver.</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Administração de Comics</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    body { background: #181818; color: #fff; font-family: sans-serif; }
    .admin-form { max-width: 420px; margin: 2rem auto; background: #222; padding: 2rem; border-radius: 16px; box-shadow: 0 2px 16px #0006; }
    label { display: block; margin-top: 1rem; }
    input, select { width: 100%; margin-top: 0.5rem; padding: 0.5rem; border-radius: 8px; border: none; }
    button { margin-top: 1.5rem; padding: 0.7rem 1.2rem; border-radius: 8px; border: none; background: #0a7; color: #fff; font-weight: bold; cursor: pointer; }
    .msg { margin-top: 1rem; padding: 1rem; border-radius: 8px; }
    .msg.success { background: #0a72; color: #0f8; }
    .msg.error { background: #a002; color: #f44; }
    hr { margin:2rem 0; border:none; border-top:1px solid #333; }
  </style>
</head>
<body>
  <div class="admin-form">
    <h2>Adicionar Nova Comic</h2>
    <form action="adminadd.php" method="post" enctype="multipart/form-data">
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
    
    <hr>
    
    <h2>Adicionar Página a Comic Existente</h2>
    <form action="adminadd.php" method="post" enctype="multipart/form-data">
      <label>Escolha a Comic
        <select name="comic_folder" required>
          <?php
          $comics = glob(__DIR__ . '/assets/comics/*', GLOB_ONLYDIR);
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
    
    <?php if ($msg) echo $msg; ?>
  </div>
</body>
</html>
