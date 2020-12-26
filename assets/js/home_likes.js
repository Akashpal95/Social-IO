const CommonLikeFunctions = (function () {
  let allLikeEventSetter = function () {
    setTimeout(function () {
      $.each($(' .like-button-form'), (index, item) => {
        LikeEventSetter(item);
      });
    }, 1000);
    // $.each($(" .like-button-form"), (index, item) => {
    //     LikeEventSetter(item);
    //   });
  };
  let LikeEventSetter = function (likeButtonForm) {
    console.log('Like event setter!');
    // console.log(likeButtonForm);
    $(likeButtonForm).submit(function (e) {
      console.log('Like button');
      console.log($(likeButtonForm).attr('action'));
      e.preventDefault();
      $.ajax({
        type: 'post',
        url: $(likeButtonForm).attr('action'),
        success: function (data) {
          console.log(data);
          if (data.data.likeable == 'Post') {
            $(`#like-${data.data.id}`).html(data.data.likesNum + " people liked this post");
          } else {
            $(`#like-${data.data.id}`).html(data.data.likesNum + " people liked this comment");
          }

        },
        error: function (err) {
          showNotification('error', 'Error in Liking Post!!');
          console.log('Error:', err.responseText);
        }
      });
    });
  };

  allLikeEventSetter();
  return {
    allLikeEventSetter,
    LikeEventSetter
  };
})();
