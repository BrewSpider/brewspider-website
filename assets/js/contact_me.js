---
---
// Contact form: browser validation, posted to Netlify Forms with AJAX.
$(function() {
  var $form = $("#contactForm");
  var $button = $("#sendMessageButton");
  var $success = $("#success");

  function check(field) {
    var $field = $(field);
    var $help = $("#" + field.id + "-help");
    if (field.validity.valid) {
      $help.text("");
      $field.removeAttr("aria-invalid");
      return true;
    }
    var message = field.validity.valueMissing ?
      $field.data("validation-required-message") :
      $field.data("validation-invalid-message") || field.validationMessage;
    $help.text(message);
    $field.attr("aria-invalid", "true");
    return false;
  }

  function notice(kind, text) {
    $success.html("");
    $("<div>").addClass("alert alert-" + kind)
      .append($("<button type='button' class='close' data-dismiss='alert' aria-label='Close'>").html("&times;"))
      .append($("<strong>").text(text))
      .appendTo($success);
  }

  $form.find("[required]").on("blur", function() {
    if (this.value !== "") check(this);
  }).on("input", function() {
    if (this.getAttribute("aria-invalid")) check(this);
  });

  $form.on("submit", function(event) {
    event.preventDefault();
    var firstInvalid = null;
    $form.find("[required]").each(function() {
      if (!check(this) && !firstInvalid) firstInvalid = this;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    $button.prop("disabled", true); // until the request is done, to prevent duplicate messages
    $.ajax({
      url: "/",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams(new FormData($form[0])).toString(),
      cache: false,
      success: function() {
        notice("success", $success.data("sent"));
        $form.trigger("reset");
      },
      error: function() {
        // keep what the person typed so they can try again
        notice("danger", $success.data("failed"));
      },
      complete: function() {
        setTimeout(function() {
          $button.prop("disabled", false);
        }, 1000);
      }
    });
  });

  // hide the success/failure notice when the person starts a new message
  $("#name").on("focus", function() {
    $success.html("");
  });
});
