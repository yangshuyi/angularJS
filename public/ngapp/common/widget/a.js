<style type="text/css">
#div1 {position:relative; width:200px; height:150px; margin: 2px auto 0; }
#div1 a {position:absolute; top:0px; left:0px; font-family: Microsoft YaHei; color:#fff; font-weight:bold; text-decoration:none; padding: 1px 2px; }
#div1 a:hover {border: 1px solid #eee; background: #000; }
#div1 .blue {color:blue;}
#div1 .red {color:red;}
#div1 .yellow {color:yellow;}
#div1 .green {color:green;}


</style>

<script type="text/javascript">
var radius = 60;
var dtr = Math.PI/180;
var d=300;

var mcList = [];
var active = false;
var lasta = 1;
var lastb = 1;
var distr = true;
var tspeed=10;
var size=200;

var mouseX=0;
var mouseY=0;

var howElliptical=1;

var aA=null;
var oDiv=null;

window.onload=function ()
{
    var i=0;
    var oTag=null;

    oDiv=document.getElementById('div1');

    aA=oDiv.getElementsByTagName('a');

    for(i=0;i<aA.length;i++)
    {
        oTag={};

        oTag.offsetWidth=aA[i].offsetWidth;
        oTag.offsetHeight=aA[i].offsetHeight;

        mcList.push(oTag);
    }

    sineCosine( 0,0,0 );

    positionAll();

    oDiv.onmouseover=function ()
    {
        active=true;
    };

    oDiv.onmouseout=function ()
    {
        active=false;
    };

    oDiv.onmousemove=function (ev)
    {
        var oEvent=window.event || ev;

        mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2);
        mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2);

        mouseX/=5;
        mouseY/=5;
    };

    setInterval(update, 30);
};

function update()
{
    var a;
    var b;

    if(active)
    {
        a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed;
        b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed;
    }
    else
    {
        a = lasta * 0.98;
        b = lastb * 0.98;
    }

    lasta=a;
    lastb=b;

    if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
    {
        return;
    }

    var c=0;
    sineCosine(a,b,c);
    for(var j=0;j<mcList.length;j++)
    {
        var rx1=mcList[j].cx;
        var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa);
        var rz1=mcList[j].cy*sa+mcList[j].cz*ca;

        var rx2=rx1*cb+rz1*sb;
        var ry2=ry1;
        var rz2=rx1*(-sb)+rz1*cb;

        var rx3=rx2*cc+ry2*(-sc);
        var ry3=rx2*sc+ry2*cc;
        var rz3=rz2;

        mcList[j].cx=rx3;
        mcList[j].cy=ry3;
        mcList[j].cz=rz3;

        per=d/(d+rz3);

        mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2);
        mcList[j].y=ry3*per;
        mcList[j].scale=per;
        mcList[j].alpha=per;

        mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6);
    }

    doPosition();
    depthSort();
}

function depthSort()
{
    var i=0;
    var aTmp=[];

    for(i=0;i<aA.length;i++)
    {
        aTmp.push(aA[i]);
    }

    aTmp.sort
    (
        function (vItem1, vItem2)
        {
            if(vItem1.cz>vItem2.cz)
            {
                return -1;
            }
            else if(vItem1.cz<vItem2.cz)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
    );

    for(i=0;i<aTmp.length;i++)
    {
        aTmp[i].style.zIndex=i;
    }
}

function positionAll()
{
    var phi=0;
    var theta=0;
    var max=mcList.length;
    var i=0;

    var aTmp=[];
    var oFragment=document.createDocumentFragment();

    //随机排序
    for(i=0;i<aA.length;i++)
    {
        aTmp.push(aA[i]);
    }

    aTmp.sort
    (
        function ()
        {
            return Math.random()<0.5?1:-1;
        }
    );

    for(i=0;i<aTmp.length;i++)
    {
        oFragment.appendChild(aTmp[i]);
    }

    oDiv.appendChild(oFragment);

    for( var i=1; i<max+1; i++){
        if( distr )
        {
            phi = Math.acos(-1+(2*i-1)/max);
            theta = Math.sqrt(max*Math.PI)*phi;
        }
        else
        {
            phi = Math.random()*(Math.PI);
            theta = Math.random()*(2*Math.PI);
        }
        //坐标变换
        mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi);
        mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi);
        mcList[i-1].cz = radius * Math.cos(phi);

        aA[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px';
        aA[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px';
    }
}

function doPosition()
{
    var l=oDiv.offsetWidth/2;
    var t=oDiv.offsetHeight/2;
    for(var i=0;i<mcList.length;i++)
    {
        aA[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px';
        aA[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px';

        aA[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';

        aA[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")";
        aA[i].style.opacity=mcList[i].alpha;
    }
}

function sineCosine( a, b, c)
{
    sa = Math.sin(a * dtr);
    ca = Math.cos(a * dtr);
    sb = Math.sin(b * dtr);
    cb = Math.cos(b * dtr);
    sc = Math.sin(c * dtr);
    cc = Math.cos(c * dtr);
}
</script>

<font face="Comic Sans MS"><strong><a href="http://weibo.com/u/3209909971/home?wvr=5&amp;lf=reg">我的标签</a>
    </strong></font><hr />
<div id="div1">
    <a href="http://www.cnblogs.com/xing901022/p/3694709.html" class="blue">2014</a>
    <a href="http://www.cnblogs.com/xing901022/p/3248913.html" class="red">2013下</a>
<a href="http://www.cnblogs.com/xing901022/archive/2013/01/18/2857982.html" class="red">2013上</a>
<a href="http://www.cnblogs.com/xing901022/archive/2012/10/19/2699162.html" class="red">2012下</a>
<a href="http://zh.linuxvirtualserver.org/" class="green">LVS中文</a>
    <a href="http://code.taobao.org/" class="green">开源</a>
    <a href="http://www.cnblogs.com/xing901022/archive/2013/04/09/3248870.html" class="blue">反向代理</a>
    <a href="http://www.cnblogs.com/xing901022/p/3248469.html" class="blue">CUDA</a>
    </div>
    <p>
    <a style="padding-right:20px;" href="http://wpa.qq.com/msgrd?v=3&amp;uin=1340601454&amp;site=qq&amp;menu=yes" target="_blank"><img style="vertical-align:bottom; border:0px" src="http://wpa.qq.com/pa?p=1:1340601454:13" alt="点击这里给我发消息" /></a></p><p>微信订阅号：<span style="color: #222222; font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei', 黑体, Arial, sans-serif; line-height: 22.3999996185303px; background-color: #ffffff;">HackerVirus</span></p><p><img src="http://images0.cnblogs.com/blog2015/104109/201506/141844064735565.png" alt="" style="line-height: 1.5;" />&nbsp;</p><p>&nbsp;<embed wmode="transparent" src="http://chabudai.sakura.ne.jp/blogparts/honehoneclock/honehone_clock_wh.swf" quality="high" bgcolor="#ffffff" width="160" height="70" name="honehoneclock" align="center" allowscriptaccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" style="line-height: 1.5;"></p>
    <font face="verdana" color="green">技术QQ群:114818988</font><br />
<a href="http://hackervirus.byethost18.com/" target="_blank" title="http://hackervirus.byethost18.com"><font size="3" color="red">欢迎点击访问个人网站</font></a>
<a href="http://xyz.freelogs.com/stats/h/hackervirus2020/" target="_top"><img border="0" alt="hit counter html code" src="http://xyz.freelogs.com/counter/index.php?u=hackervirus2020&amp;s=angelus" align="middle" hspace="4" vspace="2" /></a><script src=http://xyz.freelogs.com/counter/script.php?u=hackervirus2020></script>
    <br /><a style="font-size:12" href="http://www.freelogs.com/create.php" target="_top"><font style="font-size:12" color="#666666">hit counter html code</font></a>&nbsp;&nbsp;<span style="color: #ff5e4a; line-height: 1.5;">&nbsp;</span><p>
<embed height="200" type="application/x-shockwave-flash" width="200" src="http://images.cnblogs.com/cnblogs_com/hnboy/clock.swf" menu="false" loop="true" quality="high" wmode="transparent"> </p>
    <a href="http://info.flagcounter.com/ekni"><img src="http://s10.flagcounter.com/count2/ekni/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_1/pageviews_1/flags_0/" alt="Flag Counter" border="0" /></a>

    <hr />

    <!--<div align="left">访问：<a href="http://www.amazingcounter.com"><img border="0" src="http://cb.amazingcounters.com/counter.php?i=2887339&c=8662330" alt="track web hits" /></a> </div>-->

<p>

</p><hr />

<p><embed src="http://player.youku.com/player.php/sid/XMTQ1NzkwMjEy/v.swf" quality="high" width="200" height="220" align="center" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed></p>

<p>

<embed src="http://player.youku.com/player.php/sid/XMTIwMDE2OTg4/v.swf" quality="high" width="200" height="220" align="center" allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></embed>

    </p>

        <!-- JiaThis Button BEGIN -->
    <script type="text/javascript" >
var jiathis_config={
        siteNum:5,
        sm:"googleplus,tsina,tqq,tsohu,t163",
        summary:"",
        boldNum:2,
        showClose:true,
        hideMore:false
    }
    </script>
    <script type="text/javascript" src="http://v2.jiathis.com/code_mini/jiathis_r.js?btn=r1.gif&move=1" charset="utf-8"></script>
        <!-- JiaThis Button END -->
    <p id="back-top" style="display: block; ">
    <a href="http://i.cnblogs.com/Configure.aspx?editor=1#top"><span></span></a>
</p><div id="profile_block">昵称：<a href="http://home.cnblogs.com/u/Leo_wl/">HackerVirus</a><br/>园龄：<a href="http://home.cnblogs.com/u/Leo_wl/" title="入园时间：2009-12-16">5年8个月</a><br/>粉丝：<a href="http://home.cnblogs.com/u/Leo_wl/followers/">896</a><br/>关注：<a href="http://home.cnblogs.com/u/Leo_wl/followees/">246</a><div id="p_b_follow"></div><script type="text/javascript">cnblogs.UserManager.GetFollowStatus('775228d3-ede9-de11-ba8f-001cf0cd104b')</script></div>