let event_id_ab = document.getElementById('hidden_event_id').innerHTML;
let follow_btn = document.querySelector('#follow_btn');
let like_btn = document.querySelector('#like_btn');
let dislike_btn = document.querySelector('#dislike_btn');
let user_id = document.getElementById("hidden_user_id").innerHTML;
let attend_btn = document.querySelector('#attend_btn');
let like_p = document.getElementById('like_counts');
let dislike_p = document.getElementById('dislike_counts');

$(document).ready(function(){
    console.log(user_id);

    $.ajax({
        url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"following",userId:user_id,eventId:event_id_ab,removefollower:false,firstcall:true}),
                success: function(res){
                    let flag = res.response;
                    if(flag===true)
                    {
                        follow_btn.innerHTML='Following <i class = "fa fa-hand-spock-o"></i>';
                    }
                    else if(flag===false)
                    {
                        follow_btn.innerHTML='Follow Event <i class = "fa fa-hand-spock-o"></i>';
                    }
        }
    })

    $("#follow_btn").click(function(event){
        if(follow_btn.innerHTML.includes("Follow Event"))
        {
            follow_btn.innerHTML='Following <i class = "fa fa-hand-spock-o"></i>';
            $.ajax({
                url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"following",userId:user_id,eventId:event_id_ab,removefollower:false,firstcall:false}),
                success: function(res){
                }
            })
        }
        else{
            follow_btn.innerHTML='Follow Event <i class = "fa fa-hand-spock-o"></i>';
            $.ajax({
                url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"following",userId:user_id,eventId:event_id_ab,removefollower:true,firstcall:false}),
                success: function(res){
                }
            })
        }
    })

    $.ajax({
        url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"attending",userId:user_id,eventId:event_id_ab,removeattender:false,firstcall:true}),
                success: function(res){
                    let flag_attend = res.response;
                    if(flag_attend===true)
                    {
                        attend_btn.innerHTML='Attending<i class = "fa fa-paypal"></i>';
                    }
                    else if(flag_attend===false)
                    {
                        attend_btn.innerHTML='Attend Event<i class = "fa fa-paypal"></i>';
                    }
        }
    })

    $("#attend_btn").click(function(event){
        if(attend_btn.innerHTML.includes("Attend Event"))
        {
            attend_btn.innerHTML='Attending <i class = "fa fa-hand-spock-o"></i>';
            $.ajax({
                url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"attending",userId:user_id,eventId:event_id_ab,removeattender:false,firstcall:false}),
                success: function(res){
                }
            })
        }
        else{
            attend_btn.innerHTML='Attend Event <i class = "fa fa-hand-spock-o"></i>';
            $.ajax({
                url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"attending",userId:user_id,eventId:event_id_ab,removeattender:true,firstcall:false}),
                success: function(res){
                }
            })
        }
    })

    $.ajax({
        url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({interaction:"like_dislike",userId:user_id,eventId:event_id_ab,like_dislike:false,firstcall:true}),
                success: function(res){
                    let status = res.likestatus;
                    let like_c = res.like_counts;
                    let dislike_c = res.dislike_counts;
                    like_p.innerHTML=`Likes:${like_c}`;
                    dislike_p.innerHTML=`Dislikes:${dislike_c}`;
                    if(status===1)
                    {
                        like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: coral;"></i>';
                        dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: coral;"></i>';
                    } else if(status===2)
                    {
                        like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: black;"></i>';
                        dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: coral;"></i>';
                    }else if(status ===3)
                    {
                        like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: coral;"></i>';
                        dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: black;"></i>';
                    }
        }
    })

    $('#like_btn').click(function(event){
        if(like_btn.innerHTML.includes("coral"))
        {
            like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: black;"></i>';
        }
        else{
            like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: coral;"></i>';
        }
        $.ajax({
            url: `/events/${event_id_ab}`,
            method: "POST",
            contentType: "application/json",
            data:JSON.stringify({interaction:"like_dislike",value:"like",userId:user_id,eventId:event_id_ab,firstcall:false}),
            success: function(res){
                let flag = res.changebtn;
                let like_c = res.like_counts;
                let dislike_c = res.dislike_counts;
                like_p.innerHTML=`Likes:${like_c}`;
                dislike_p.innerHTML=`Dislikes:${dislike_c}`;
                if(flag===1)
                {
                    dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: coral;"></i>';
                }
                
            }
        })
    })

    $('#dislike_btn').click(function(event){
        if(dislike_btn.innerHTML.includes("coral"))
        {
            dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: black;"></i>';
        }
        else{
            dislike_btn.innerHTML='<i class="fa fa-thumbs-down" style="color: coral;"></i>';
        }
        $.ajax({
            url: `/events/${event_id_ab}`,
            method: "POST",
            contentType: "application/json",
            data:JSON.stringify({interaction:"like_dislike",value:"dislike",userId:user_id,eventId:event_id_ab,firstcall:false}),
            success: function(res){
                let flag = res.changebtn;
                let like_c = res.like_counts;
                let dislike_c = res.dislike_counts;
                like_p.innerHTML=`Likes:${like_c}`;
                dislike_p.innerHTML=`Dislikes:${dislike_c}`;
                if(flag===0)
                {
                    like_btn.innerHTML='<i class="fa fa-thumbs-up" style="color: coral;"></i>';
                }
            }
        })
    })

   
})
