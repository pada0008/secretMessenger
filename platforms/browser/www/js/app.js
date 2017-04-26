"use strict";
var appSMData = {
    user_id: null
    , user_guid: null
};
var appSM = {
    key: "secretM-dosh0005-pada0008"
    , bUrl: "http://griffis.edumedia.ca/mad9022/steg/"
    , msglist: []
    , users: []
    , review_list: null
        /*---- model add ----*/
        
    , init: function () {
        if (!(localStorage.getItem(appSM.key) === null)) {
            appSM.data = localStorage.getItem(appSM.key);
            appSM.data = JSON.parse(appSM.data);
        }
        appSM.setIndex();
        appSM.loadIndex();
        document.getElementById("btn-sendClose").addEventListener("touchend", appSM.msgSendReset);
        document.getElementById("btn-viewClose").addEventListener("touchend", appSM.msgViewReset);
    }
    , storeLocal: function () {
        var d = JSON.stringify(appSMData);
        localStorage.removeItem(appSM.key);
        localStorage.setItem(appSM.key, d);
    }
    , setIndex: function () {
        appSMData.user_guid = null;
        appSMData.user_id = null;
        document.getElementById("btn-login").addEventListener("touchend", appSM.mlogin);
        document.getElementById("btn-register").addEventListener("touchend", appSM.mRegister);
        appSM.gotoIndex();
        document.getElementById("btn-img").addEventListener("touchend", appSM.captureAdd);
        document.getElementById("btn-sendmsg").addEventListener("touchend", appSM.msgSend);
    }
    , checkLogin: function () {
        if (appSMData.user_guid == null || appSMData.user_guid == "") {
            appSM.gotoIndex();
        }
        return true;
    }
    , gotoIndex: function () {
        var link = document.getElementById('btn-logout');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        link.dispatchEvent(myClick);
    }
    , loadIndex: function () {
        appSMData.user_guid = null;
        appSMData.user_id = null;
        var link = document.getElementById('btn-logout');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        link.dispatchEvent(myClick);
        var msglist = document.getElementById("page-index");
        msglist.className = "content hide";
    }
    , loadmsg: function () {
        var link = document.getElementById('btn-logout');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        link.dispatchEvent(myClick);
    }
    , mlogin: function () {
        var url = appSM.bUrl + "login.php";
        appSM.mLRProcess(url);
    }
    , mRegister: function () {
        var url = appSM.bUrl + "register.php";
        appSM.mLRProcess(url);
    }
    , mLRProcess: function (url) {
        var un = document.getElementById("user_name");
        var email = document.getElementById("email");
        var data = new FormData();
        data.append("user_name", un.value);
        data.append("email", email.value);
        var myInit = {
            //mode: "no-cors"
            mode: "cors"
            , method: "POST"
            , body: data
        };
        var req = new Request(url, myInit);
        fetch(req).then(function (response) {
            return response.json();
        }).then(function (jD) {
            if (jD.code == '0' || jD.code == 0) {
                appSMData.user_id = jD.user_id;
                appSMData.user_guid = jD.user_guid;
                appSM.storeLocal();
                console.log(jD.message);
                appSM.loadmsg();
                appSM.userGet();
                appSM.msgGet();
            }
            else {
                var err = document.getElementById("err");
                err.innerHTML = jD.message;
                console.log(jD.message);
            }
        }).catch(function (err) {
            console.log("err : " + err);
        });
    }
    , msgGet: function () {
        appSM.checkLogin();
        var url = appSM.bUrl + "msg-list.php";
        var data = new FormData();
        data.append("user_id", appSMData.user_id);
        data.append("user_guid", appSMData.user_guid);
        var myInit = {
            //mode: "no-cors"
            mode: "cors"
            , method: "POST"
            , body: data
        };
        var req = new Request(url, myInit);
        fetch(req).then(function (response) {
            return response.json();
        }).then(function (jD) {
            if (jD.code == '0' || jD.code == 0) {
                console.log(jD.message);
                appSM.msgDraw(jD);
            }
            else {
                var err = document.getElementById("err");
                err.innerHTML = jD.message;
                console.log(jD.message);
            }
        }).catch(function (err) {
            console.log("err : " + err);
        });
    }
    , msgDraw: function (dataAll) {
        console.log("geting list : "+ dataAll);
        var msglist = document.getElementById("page-index");
        msglist.className = "content";
        var data = dataAll.messages;
        var ml = document.getElementById('msg-list');
        ml.innerHTML = "";
        if (data.length) {
            data.forEach(function (m, i) {
                //console.log(m);
                var li = document.createElement("li");
                li.className = "table-view-cell media";
                var span_r_arrow = document.createElement("span");
                span_r_arrow.className = "pull-right icon icon-right-nav";
                var divMedia = document.createElement("div");
                divMedia.className = "media-body";
                var p_idea = document.createElement("a");
                p_idea.setAttribute("href", "#model-view");
                p_idea.innerHTML = "Message From : " + m.user_name;
                divMedia.appendChild(p_idea);
                li.appendChild(span_r_arrow);
                li.appendChild(divMedia);
                ml.appendChild(li);
                p_idea.addEventListener("touchend", function (i) {
                    return function () {
                        console.log(m.msg_id);
                        appSM.msgGetContent(m.msg_id);
                    }
                }(i));
            })
        }
        else {
            ml.innerHTML = "<li class='msg'>" + dataAll.message + "</li>";
        }
    }
    , userGet: function () {
        appSM.checkLogin();
        
        var url = appSM.bUrl + "user-list.php";
        var data = new FormData();
        data.append("user_id", appSMData.user_id);
        data.append("user_guid", appSMData.user_guid);
        var myInit = {
            //mode: "no-cors"
            mode: "cors"
            , method: "POST"
            , body: data
        };
        var req = new Request(url, myInit);
        fetch(req).then(function (response) {
            return response.json();
        }).then(function (jD) {
            if (jD.code == '0' || jD.code == 0) {
                console.log(jD.message);
                appSM.users = jD.users;
                var rl = document.getElementById("recipient_id");
                appSM.users.forEach(function (u, i) {
                    var o = document.createElement("option");
                    o.setAttribute("value", u.user_id);
                    o.innerHTML = u.user_name;
                    rl.appendChild(o);
                });
            }
            else {
                err.innerHTML = jD.message;
                console.log(jD.message);
            }
        }).catch(function (err) {
            console.log("err : " + err);
        });
    }
    , captureAdd: function () {
        //        navigator.camera.getPicture(appSM.camOnSuccess, appSM.camOnFail, {
        //            destinationType: Camera.DestinationType.FILE_URI
        //            , quality: 50
        //            , encodingType: Camera.EncodingType.JPEG
        //                //            , mediaType: Camera.MediaType.PICTURE
        //                
        //            , mediaType: Camera.MediaType.SAVEDPHOTOALBUM
        //            , allowEdit: true
        //            , correctOrientation: true
        //        });
    }
    , camOnSuccess: function (imageData) {
        var img = document.createElement('img');
        img.setAttribute("id", "image");
        img.src = imageData;
        var ig = document.getElementById("place-img");
        ig.innerHTML = "";
        ig.appendChild(img);
    }
    , camOnFail: function (err) {
        console.log('Err : ' + err);
    }
    , msgSend: function () {
        var recipient_id = document.getElementById("recipient_id");
        var msg = document.getElementById("secretmsg");
        var img = document.getElementById("imgs");
        var err = document.getElementById("err-1");
        if (recipient_id.value == "" || msg.value == "" || img.getAttribute("src") == "") {
            err.innerHTML = "Missing required fields"
        }
        else {
            err.innerHTML = ""
                /*image-canvas*/
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext('2d');
            var img1 = document.getElementById('imgs');
            var w = img1.width;
            var h = img1.height;
            c.style.width = w + 'px';
            c.style.height = h + 'px';
            c.width = w;
            c.height = h;
            ctx.drawImage(img1, 0, 0);
            //
            // convert user id number to bit array
            //
            var userid = BITS.numberToBitArray(recipient_id.value);
            //
            // convert msg length number to bit array
            //
            var msglgt = BITS.numberToBitArray(msg.value.length);
            //
            // convert msg to bit array 
            //
            var msgbit = BITS.stringToBitArray(msg.value);
            //
            // put every thing in to canvas
            //
            c = BITS.setUserId(userid, c);
            c = BITS.setMsgLength(msglgt, c);
            c = BITS.setMessage(msgbit, c);
            //
            // SUBMIT DATA TO SERVER : msg-send.php
            // 
            appSM.checkLogin();
            var url = appSM.bUrl + "msg-send.php";
            var data = new FormData();
            var dataurl = c.toDataURL('image/jpeg', 0.8);
            var blob = appSM.dataURItoBlob(dataurl);
            data.append("user_id", appSMData.user_id);
            data.append("user_guid", appSMData.user_guid);
            data.append('recipient_id', recipient_id.value);
            data.append('image', blob);
            var myInit = {
                //mode: "no-cors"
                mode: "cors"
                , method: "POST"
                , body: data
            };
            var req = new Request(url, myInit);
            fetch(req).then(function (response) {
                return response.json();
            }).then(function (jD) {
                console.log(jD);
                if (jD.code == '0' || jD.code == 0) {
                    console.log(jD.message);
                    appSM.msgSendClose();
                    appSM.msgGet();
                }
                else {
                    var err = document.getElementById("err-1");
                    err.innerHTML = jD.message;
                    console.log(jD.message);
                }
            }).catch(function (err) {
                console.log("err : " + err);
            });
        }
    }
    , msgSendClose: function () {
        appSM.msgSendReset();
        var link = document.getElementById('btn-sendClose');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        link.dispatchEvent(myClick);
    }
    , msgSendReset: function () {
        var recipient_id = document.getElementById("recipient_id");
        recipient_id.value = "";
        var msg = document.getElementById("secretmsg");
        msg.value = "";
    }
    , dataURItoBlob: function (dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/jpeg'
        });
    }
    , msgGetContent: function (mid) {
        var url = appSM.bUrl + "msg-get.php";
        var data = new FormData();
        data.append("user_id", appSMData.user_id);
        data.append("user_guid", appSMData.user_guid);
        data.append("message_id", mid);
        var myInit = {
            //mode: "no-cors"
            mode: "cors"
            , method: "POST"
            , body: data
        };
        var req = new Request(url, myInit);
        fetch(req).then(function (response) {
            return response.json();
        }).then(function (jD) {
            if (jD.code == '0' || jD.code == 0) {
                var name_r = document.getElementById("recitient_name");
                var name_s = document.getElementById("sender_name");
                var imgg = document.getElementById("place-img-1");
                var msg = document.getElementById("msg-show");
                var btndelete = document.getElementById("btn-msgdelete");
                var usss = appSM.users;
                usss.forEach(function (u, i) {
                    if (parseInt(u.user_id) === parseInt(jD.sender)) {
                        name_s.innerHTML = "To : " + u.user_name;
                    }
                    if (parseInt(u.user_id) === parseInt(jD.recipient)) {
                        name_r.innerHTML = "To : " + u.user_name;
                    }
                });
                var image = new Image();
                image.crossOrigin = '';
                image.src = appSM.bUrl + jD.image;
                image.onload = function () {
                    var c = document.getElementById("myCanvas-view");
                    var ctx = c.getContext('2d');
                    var w = image.width;
                    var h = image.height;
                    c.style.width = w + 'px';
                    c.style.height = h + 'px';
                    c.width = w;
                    c.height = h;
                    ctx.drawImage(image, 0, 0);
                    var uid = BITS.numberToBitArray(appSMData.user_id)
                    var secret = BITS.getMessage(uid, c);
                    console.log(secret);
                    msg.innerHTML = secret;
                }
                imgg.appendChild(image);
                btndelete.addEventListener('touchend', function (mid) {
                    return function () {
                        if (confirm("Are your sure want to delete this message ?")) {
                            var url1 = appSM.bUrl + "msg-delete.php";
                            var data1 = new FormData();
                            data1.append("user_id", appSMData.user_id);
                            data1.append("user_guid", appSMData.user_guid);
                            data1.append("message_id", mid);
                            var myInit1 = {
                                mode: "cors"
                                , method: "POST"
                                , body: data1
                            };
                            var req1 = new Request(url1, myInit1);
                            fetch(req1).then(function (response1) {
                                return response1.json();
                            }).then(function (jD1) {
                                if (jD1.code == '0' || jD1.code == 0) {
                                    console.log(jD1.message);
                                    appSM.msgViewClose();
                                    appSM.msgGet();
                                }
                                else {
                                    err.innerHTML = jD1.message;
                                    console.log(jD1.message);
                                }
                            }).catch(function (err) {
                                console.log("err : " + err);
                            });
                        }
                    }
                }(mid));
            }
            else {
                err.innerHTML = jD.message;
                console.log(jD.message);
            }
        }).catch(function (err) {
            console.log("err : " + err);
        });
    }
    , msgViewClose: function () {
        appSM.msgViewReset();
        var link = document.getElementById('btn-viewClose');
        var myClick = new CustomEvent('touchend', {
            bubbles: true
            , cancelable: true
        });
        link.dispatchEvent(myClick);
    }
    , msgViewReset: function () {
        var name_r = document.getElementById("recitient_name");
        name_r.innerHTML = "";
        var name_s = document.getElementById("sender_name");
        name_s.innerHTML = "";
        var imgg = document.getElementById("place-img-1");
        imgg.innerHTML = "";
        var msg = document.getElementById("msg-show");
        msg.innerHTML = "";
    }
    , searchUser: function (uid) {}
}
document.addEventListener("deviceready", appSM.init);