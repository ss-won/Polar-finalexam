$(document).ready(function () {
    $(".btn-delete").click(function () {

        var _id = $(this).data("id");
        swal({
            title: '경고',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네 삭제하겠습니다',
            cancelButtonText: '아니요'
        }).then(function () {
            $.ajax({
                url: '/delete',
                type: 'post',
                data: {id: _id},
                success: function (response) {
                    location.href = '/';
                }
            });
        })
    })


    $(".btn-submit").click(function () {

        var name = $("input[name='name']").val();
        var age = $("input[name='rtag']").val();
        var stdId = $("input[name='tags']").val();

        /* 에러 분기처리 */
        if(!name){
            swal('경고', '이름필드를 확인하여주세요.', 'error')
        }else if(!age){
            swal('경고', '대표태그필드를 확인하여주세요.', 'error')
        }else if(!stdId){
            swal('경고', '태그를 확인하여주세요.', 'error')
        }else{
            $(this).closest("form").submit();
        }


    });


});