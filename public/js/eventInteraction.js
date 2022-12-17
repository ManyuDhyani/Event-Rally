let event_id_ab = document.getElementById('hidden_event_id').innerHTML;
let follow_btn = document.querySelector('#follow_btn');
let user_id = document.getElementById("hidden_user_id").innerHTML;
let attend_btn = document.querySelector('#attend_btn');

$(document).ready(function(){
    console.log(user_id);

    $.ajax({
        url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removefollower:false,firstcall:true}),
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
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removefollower:false,firstcall:false}),
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
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removefollower:true,firstcall:false}),
                success: function(res){
                }
            })
        }
    })

    $.ajax({
        url: `/events/${event_id_ab}`,
                method: "POST",
                contentType: "application/json",
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removeattender:false,firstcall:true}),
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
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removeattender:false,firstcall:false}),
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
                data:JSON.stringify({userId:user_id,eventId:event_id_ab,removeattender:true,firstcall:false}),
                success: function(res){
                }
            })
        }
    })

   
})
