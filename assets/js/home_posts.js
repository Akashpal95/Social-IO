{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost =  newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);
                },
                error:function(error){
                    console.log(error.responseText)
                }
            });
        });
    }
    //method to create a posted message in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post.id}">X</a>
                        </small>
                        ${post.content}
                        <br>
                        <small>
                            -${ post.user.name}
                        </small>
                    </p>
                    <div id="post-comments">
                            <div class="post-comments-list">
                                    <ul id ="post-comments-${post._id}">
                                    </ul>
                                </div>
                            <form action="/comments/create" class="new-comment-form" method="POST">
                                <input type="text" name="content" placeholder="Write comment..." required></textarea>
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value = "Add Comment" >
                            </form>
                        
                    </div>
                    
                </li>`);
    }

    createPost();
}