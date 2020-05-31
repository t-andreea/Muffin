function starting() {
  alert("Page loading...")
}

function remove(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/products/delete', true);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert(this.response)
        location.reload(); 
      }
  }
  xhr.send("prod_id=" + id);
}

function redir() {
  var val = document.getElementById("command").value;
  var xhr = new XMLHttpRequest();

  xhr.open("POST", '/order', true);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        alert(this.response)
        location.reload(); 
      }
  }
  xhr.send(val);
}