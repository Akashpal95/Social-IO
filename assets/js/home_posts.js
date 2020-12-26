{
  let showNotification = function (type, message) {
    new Noty({
      theme: 'relax',
      text: message,
      type: type,
      layout: 'topRight',
      timeout: 1500
    }).show();
  };

  let allPostEventSetter = function () {
    //Setting event on all delete links
    $.each($(' .delete-post-button'), (index, item) => {
      deletePost(item);
    });
  };
  //method to submit the form data for new post using AJAX
  let createPostEventSetter = function () {
    let newPostForm = $('#new-post-form');
    //use jQuery function to set submit event listener
    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'post',
        url: '/posts/create',
        data: newPostForm.serialize(), //jQuery function to serialise for data
        success: function (data) {
          let newPost = newPostDom(data.data);
          console.log('Data in home post: ', data);
          $('#posts-list-container').prepend(newPost);
          //$(' .delete-post-button', newPost) : this is to find the element with given class inside newPost
          //The space before the .delete-p... is very important!!
          deletePost($(' .delete-post-button', newPost));
          createComment($(' .new-comment-form', newPost));
          CommonLikeFunctions.LikeEventSetter($(' .like-button-form', newPost));
          showNotification('success', 'Successfully Posted!!');
        },
        error: function (error) {
          showNotification('error', 'Error in posting status!!');
          console.log(error.responseText);
        }
      });
    });
  };
  //method to create a posted message in DOM
  let newPostDom = function (data) {

    return $(`<li class="post-card" id="post-${data.post._id}">
                    <div class="user-card">
                        <img class="profile-pic-micro" src="https://www.flaticon.com/svg/static/icons/svg/3011/3011270.svg">
                        <p>
                            <a href="/users/profile/${data.user_id}">${data.username}</a>
                        </p>
                        <div class="options-container">
                          <div class="more-container">
                              <a class="delete-post-button" href="/posts/destroy/${data.post._id}">Delete</a>
                          </div>
                          <div class="more-container">
                              <img src="https://www.flaticon.com/svg/static/icons/svg/1828/1828687.svg">
                          </div>
                      </div>
                    </div>
                    <div class="post-content-container">
                    ${data.post.content}
                    </div>
                    <form class="like-button-form" action="/likes/toggle/?id=${data.post._id}&type=Post" method="POST">
                    <span class="like-view" id="like-${data.post._id}">${data.post.likes.length} people liked this post</span>
                    &nbsp;
                    <button type="submit"><i class="far fa-thumbs-up"></i></button>
                    </form>
                    <br>
                    <div id="post-comments">
                            <div class="post-comments-list">
                                    <ul id ="post-comments-${data.post._id}">
                                    </ul>
                                </div>
                            <form action="/comments/create" class="new-comment-form" method="POST">
                                <input type="text" name="content" placeholder="Write comment..." required></textarea>
                                <input type="hidden" name="post" value="${data.post._id}">
                                <input type="submit" value = "Add Comment" >
                            </form>
                        
                    </div>
                    
                </li>`);
  };

  //method to delete a post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          // console.log(data);
          $(`#post-${data.data.post_id}`).remove();
          showNotification('success', 'Post deleted!!');
        },
        error: function (data) {
          showNotification('error', 'Error in deleting Post!!');
          console.log('Error:', err.responseText);
        }
      });
    });
  };

  createPostEventSetter();
  allPostEventSetter();

}
