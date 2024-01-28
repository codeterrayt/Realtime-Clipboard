<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
  <link rel="stylesheet" href="./assets/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>

<div class="dashboard" data-aos="flip-up" data-aos-duration="1000" id="dashboard_box">
    <div class="top-area">
      <h2 id="dashboard_title">Dashboard</h2>
        <br>
        <hr>
        <br>
        <button class="btn-logout btnn" id="btn-logout">Logout</button>
        <button class="create-clipboard btnn" id="create-clipboard">Create ClipBoard</button>
        <button class="delete-all-clipboard btnn" id="delete_all_clipboards">Delete All ClipBoards</button>

        <button class="show-user-id btnn" id="show-user-id">Show User ID</button>
        <button class="open-with-clip-id btnn" id="open-with-clip-id-btn">Open with Clip ID</button>

        <div style="height:70vh;  overflow-x:scroll;">
        <table class="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Clipboard Title</th>
              <th>Clip ID</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody id="data-table-body">
              <progress id="fetching_data_progress"></progress>
          </tbody>
          
        </table>
        </div>
    
    
    </div>
</div>

  <div class="text-box" id="content-box" data-aos="flip-up"  data-aos-duration="1000">
    <div class="top-area">
      <h2 id="note_title">Content Title</h2>
      <h2 class="saving_text" id="saving_text">Saving...</h2>
      <div class="copy-btn" id="copy-btn" data-aos="fade-in" data-aos-delay="1000"><i class="fa-solid fa fa-copy"></i></div>

    </div>
    <textarea id="main_clipboard" rows="5" wrap="virtual" spellcheck="false"> 
      </textarea>
  </div>
    <script src="./assets/script.js"></script>
    <script>
      AOS.init();
    </script>
</body>

</html>