//Jeu créé par Lucas Meier-26.04.2016-  "Space Invaders3000"
//Toute copie intégrale ou partielle du code est exclue
//Les sons ont été téléchargés depuis le site "FreeSound.org"
//Les images proviennent de sources diverses
//Pour jouer, sélectionnez une difficulté de jeu une fois la page chargée sur une échelle de 1 à 4
//Ensuite, éliminez toutes les vagues de monstres en vous aidant de la barre d'espace pour tirer et les flèches directionnelles de gauche et de droite pour vous déplacer.
var help=new Array(25);  //voir feuille annexe
for (var i=0;i<help.length;i=i+1){
    help[i]=1;
}
var t10= new Array(22);     //tableaux de controle des monstres à 10,20,40 points
var t20= new Array(22);
var t40= new Array(22);
var tbg= new Array(10); //tableau qui dit où sont placés les monstres depuis la gauche
var tbd= new Array(10); // '' ...depuis la droite
var tbmg= new Array(10);   //tableau qui dit où sont les monstres e20 (ceux qui sont au milieu) depuis la gauche
var tbmd= new Array(10);    //''...depuise la droite
var em= new Array(); //de la forme [emx,emy,1(c'est un test),emx2,emy2,1,emx3.,emy3,1]
var ems=0; //ennemi missile number
var ttir=1000;      //temps entre chaque tir du vaisseau
var v=5;            //nombre de pixels que le vaisserau se déplace à chaque déplacement (=environ vitesse)
var vv=30;          //vitesse du vaisseau
var vx=100;         //=~vitesse des monstres  
var difficulte=0.5  //à choisir au début
var vm=30;          //vitesse des monstres
var niveau=1;
var xv=181; //coordonnée x du vaisseau
var yv=450;  //coordonnée y du vaisseau
var ctx,xe1,xe2,xe4,tquoi,ran,emx,emy,ra14,ra2,tm1,tm2,tm3,mlaser,ttlaser,tt1laser; //voir feuille annexe
var exagauche=0;  //examinateur des cotés gauches des tables des monstres (compte de combien les monstres peuvent se décaler à gauche)
var exadroite=0;
var cote=0;     //compte le nombre de fois que les monstres "touchent" les bords
var xeb=0;      //décalage des monstres-lorsqu'on fait bouger les monstres, on augmentera cette variable. Onplacera ensuite les monstres aux coordonnées (xe1+xeb,y)
var vie=3;
var score=0;
var kill=0;     //nombre de monstres tués par niveau
var nbm=0;  //nombre de missiles en vol
var m1=new Array(0,450);  //deux dimensions: new Array(20,30);
var m2=new Array(0,450);    //m1,m2,m3 sont pour les missiles du vaisseau
var m3=new Array(0,450);  //la coordonnée y du missile 3 vaut 450
var menuaudio=new Audio("image_son/intro.mp3");
var levelup=new Audio("image_son/level-up.mp3");
var startaudio=new Audio("image_son/soundstartspace.mp3");
var vlaseraudio=new Audio("image_son/vlasersound1.mp3");
var laser=new Audio("image_son/laser.mp3");
var reload=new Audio("image_son/reload.mp3");
var boome10=new Audio("image_son/boom_e10.mp3");
var boome20=new Audio("image_son/boom_e20.mp3");
var boome40=new Audio("image_son/boome40.mp3");
var explosion1audio=new Audio("image_son/explosion1.mp3");
var gameoveraudio=new Audio("image_son/gameover.mp3");
var endaudio=new Audio("image_son/happyend.mp3");
function $(id) {
    return document.getElementById(id)
    }
function tab() {
for (var i=0;i<11;i=i+1){
    t10[i]=1;       //les trois tableaux t10, t20 et t40 sont remplis de 1. Ils repreésentent un monstre encore vivant
    t20[i]=1;
    t40[i]=1;
    t10[21-i]=200;
    t20[21-i]=200;
    t40[21-i]=200;
}
}
function tableaux() {
    if (niveau==1) {    //permet de réinitialiser les tableaux lorsqu'on recommence
        tbmd=[0];
        tbmg=[0];
        tbg=[1,0];
        tbd=[0,1];
    }
    else{
        for (var i=0;i<=niveau+1;i+=1) {
        tbg[niveau-i]=Math.ceil(i%2)*(i-(i-1))*(niveau+1)+Math.pow(-1,i)*(i-Math.ceil((i-1)/2));
        tbd[niveau-i]=Math.ceil((i+1)%2)*(i-(i-1))*(niveau+1)+Math.pow(-1,(i-1))*(i-Math.ceil((i-1)/2))-1;   //monstres e40 et e10 depuis la droite
        tbmg[niveau-1-i]=Math.ceil(i%2)*(i-(i-1))*(niveau)+Math.pow(-1,i)*(i-Math.ceil((i-1)/2));    //monstres du milieu depuis la gauche
        tbmd[niveau-1-i]=Math.ceil((i+1)%2)*(i-(i-1))*(niveau)+Math.pow(-1,(i-1))*(i-Math.ceil((i-1)/2))-1;
        //voir feuille annexe. Ces tableaux indiquent dans quel ordre les monstres apparaissent de chaque coté à chaque niveau.
        //les monstres du milieu ne sont pas comme les monstres e40 et e10, ils sont intercalés.
        }
    }
}
function init(){
    ctx=$("canvas").getContext("2d");
    startimage= new Image();        //c'est l'image avec "insert coin"
    startimage.src="image_son/start.jpg";
    gameoverimg= new Image();
    gameoverimg.src="image_son/game-over.jpg";
    youwin=new Image();
    youwin.src="image_son/youwin.jpg";
    e10= new Image(); //image de l'ennemi qui vaut 100 points
    e10.src="image_son/10space.gif";
    e102=new Image();   //image de l'ennemi qui vaut 100 points avec les ailes en bas
    e102.src="image_son/10space2.gif"
    e20= new Image();       //image de l'ennemi à 200 points
    e20.src="image_son/20space.gif";
    e202=new Image();
    e202.src="image_son/20space2.gif"
    e40= new Image();       //image de l'ennemi à 400 points
    e40.src="image_son/40space.gif";
    e402=new Image();
    e402.src="image_son/40space2.gif";
    vai= new Image();       //image du vaisseau
    vai.src="image_son/vaisseau.png"; //taille:38px x 38px
    cur= new Image();       //image des coeurs
    cur.src="image_son/cur.png";
    tab();
    tableaux();
    menuaudio.play();
    
    ttaf=setTimeout(affiche,25);    //lors du premier chargement de la page, le navigateur exécuterait la commande du css d'afficher la lune en fond de canvas après que le javascript dise de mettre l'image de base, si il n'y avait pas eu ce Timeout
    window.addEventListener("keydown", touched, false);
    window.addEventListener("keyup", toucheup, false);
}
function affiche() {
    ctx.drawImage(startimage,0,0);
}
function touched(event) {    //controle quelle touche a été enfoncée
    switch (event.keyCode) {
        case 32:
            vtire();
            break;
        case 37:
            vdgauche();
            break;
        case 39:
            vddroite();
            break;
        case 49:
            start(0.25);
            break;
        case 50:
            start(0.5);
            break;
        case 51:
            start(0.75);
        case 52:
            start(1);
            break;
        case 67:
            las();
            break;
    }
}
function toucheup(event) {
    switch (event.keyCode) {
        case 32:
            vstop();
            break;
        case 37:
            vfgauche();
            break;
        case 39:
            vfdroite();
            break;
    }
}
function start(dif) {
    if (help[1]==1 && help[24]==1) {     //teste si le jeu est deja parti ou non
        $("pa").innerHTML="ARROWS TO MOVE ! PRESS SPACEBAR TO FIRE ! PRESS C TO ENABLE THE LASER !";
        difficulte=dif;
        menuaudio.pause();      //arrete la musique de l'écran principal
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(vai,xv,yv);
        gameoveraudio.pause();  //arrete la musique de l'écran de game over si elle est jouée
        gameoveraudio.currentTime = 0;  //rembobinne la musique de gameover
        startaudio.play();  //lance la musique de départ de jeu
        help[1]=-1; //le jeu est parti
        help[6]=-1;
        help[7]=-1;
        ecrit(); 
        tad=setTimeout(mouvementaile,1000);
        th=setTimeout(reset,1100);
        ta=setInterval(mouvementaile,4000);   //toutes les 4 secondes, les monstres bougent leur ailes
        tedb=setTimeout(edbouge,1000);  //appelle les monstres au bout d'une seconde
        ett=setTimeout(etire,1000*1/((difficulte*7*(((help[16]-1)*4)+1))/(((help[16]-1)*4)+1+20)));
        //cela suit une fonction dont l'asymptote est plus où moins à 6 fois la difficulté, chiffre au dessus duquel les monstres tirent trop pour jouer agréablement
    }
    if (help[24]==-1) {  //si on a recommencé
        help[24]=1;
        restart1();
        start(dif);
    }
}
function reset() {  //comme l'augmentation des tirs ennemis par seconde dépend du temps et que le temps est mesuré par help[16], il faut le réinitialiser à chaque niveau et au début il doit valoir 1
    help[16]=1;
}
function mouvementaile() {
    help[16]+=1;   // quand help[16] vaut 1 les ailes sont dessinées en haut, sinon l'inverse
    clearInterval(ett);
    ett=setInterval(etire,1000*1/((difficulte*7*(((help[16]-1)*4)+1))/(((help[16]-1)*4)+1+20)));
}
function ecrit() {
    ctx.font = " 10pt Minecraft";   //prend une police 
    ctx.fillStyle = "#fff";         //couleur blanche 
    ctx.fillText("SCORE   "+score, 10, 19);
    ctx.fillText("LEVEL "+niveau,175,19);
    ctx.fillText("LIVES", 290, 19);
    for (var i=0;i<vie;i=i+1){          //dessine le meme nombre de coeurs que de vies restantes
        ctx.drawImage(cur,335+20*i,6);
    }
    ctx.clearRect(0,490,400,500);
    for(var i=0;i<help[0]-1;i=i+1) {    //dessine autant de ronds de chargement qu'il faut
        ctx.beginPath();
        ctx.fillStyle="yellow";
        ctx.arc(300+i*8+i*5,494,4,0,2*Math.PI);
        ctx.fill();
    }
    ctx.fillStyle="white";
    if (help[14]==1) {      //si le laser est prêt à être chargé
        ctx.beginPath();
        ctx.fillStyle="green";
        ctx.arc(300+2*8+2*5,494,4,0,2*Math.PI);
        ctx.fill()
        ctx.fillStyle="white";
    }
    if (help[13]==-1) {     //si le canon est chargé
        ctx.beginPath();
        ctx.fillStyle="red";
        ctx.arc(300+3*8+3*5,494,4,0,2*Math.PI);
        ctx.fill();
        ctx.fillStyle="white";  //il faut à chaque fois remettre le fillStile à white, car sinon les missiles du vaisseau autont une mauvaise couleur quelques secondes.
    }
    }
function vddroite() {   //vaisseau-debut du mouvement de droite
    if (help[6]==-1) {     //controle qu'on a pas deja touché
    td=setInterval(vdroite,vv); //appelle une fonction qui fait déplacer
    help[6]*=-1;
    }
}
function vdgauche() {
    if (help[7]==-1) {  //semblable à la fonction précédante, mais pour la gauche
        tg=setInterval(vgauche,vv);
        help[7]*=-1;
    }
}
function vfdroite() {   //vaisseau-fin déplacement de droite
    clearInterval(td);    //arrete d'appeler la fonction de déplacement
    if (help[1]==-1) {
        help[6]=-1;
    }
}
function vfgauche() {  //vaisseau-fin déplacement de gauche
    clearInterval(tg);
    if (help[1]==-1) {
        help[7]=-1;
    }
}
function vdroite(){
    if (xv<352) {    //si on est pas tout à droite;
        xv=xv+v;
        xm=xv;  
        ctx.drawImage(vai,xv,yv);
        ctx.clearRect(xv-v, yv, v, 38);  //efface à gauche du vaisseau l'espace où le vaisseau n'est plus
    }
}
function vgauche(){     //vaisseau va à gauche (voir vdroite)
    if (xv>6) {
        xv=xv-v;
        xm=xv;  
    ctx.clearRect(xv+38, yv, v, 38);
    ctx.drawImage(vai,xv,yv); 
    }
}
function vtire(){
    if (help[3]==1) {   //appelle la fonction vballe tous les ttir de temps
        tt=setInterval(vballe,ttir);
    }
    if (help[4]==1 && help[3]==1) {
        vballe();
        help[4]=-1;
    }
    //les deux if permettent qu'il n'y ait pas d'attente dans le cas où aucun missile n'a encore été tiré.
    help[3]=-1;
}
function vballe() {
    score=score-1;
    nbm+=1; //le nombre de missiles en vol augmente de 1
    if (help[1]==-1) {
    switch (help[2]) { //le help[2] numérote chaque missile
        case 1:
            if (m1[1]==yv) {
                m1[0]=xv;
                tm1=setInterval(mis1,vm);   //lance la fonctino qui va dessiner le missile avec un interval
                if (help[13]==-1 && mlaser==1) {
                    laser.play();
                }
                else {
                    vlaseraudio.play();
                }
                help[2]=help[2]+1;
            }
            break;
    
        case 2:
            
            if (m2[1]==yv) {
                m2[0]=xv;
                tm2=setInterval(mis2,vm);
                if (help[13]==-1 && mlaser==2) {
                    laser.play();
                }
                else {
                    vlaseraudio.play();
                }
                help[2]=help[2]+1;
            }
            break;
    
        case 3:
            
            if (m3[1]==yv) {
                m3[1]=yv; 
                m3[0]=xv;
                tm3=setInterval(mis3,vm);
                if (help[13]==-1 && mlaser==3) {
                    laser.play();
                }
                else {
                    vlaseraudio.play();
                }
                help[2]=1;
            }
            break;
    }
    }
}
function las() {
    if (help[14]!=-1) {
        help[13]=-1;
        help[14]=-1;
        mlaser=help[2];    //le mlaser prend la valeur du prochain missile qui va être tiré (voir vballe())
        ttlaser=setTimeout(laseron,10000);
    }
}
function laseron() {
    help[0]+=1
    if (help[0]==4) {
        help[14]=1;
        reload.play();
        help[0]=1;
    }
    else {
        tt1laser=setTimeout(laseron,10000);
    }
    
}
function mis1() { 
    if (m1[1]<445) {
        ctx.clearRect(m1[0]+18,m1[1],2,10);
    }
    ecrit();
    ctx.beginPath();
    if (mlaser==1) {        //si il s'agit ici du laser, alors le créer en rouge
        ctx.fillStyle="red";
    }
    ctx.fillRect(m1[0]+18,m1[1]-10,2,10);
    ctx.fillStyle="white";
    m1[1]=m1[1]-5;
    if (m1[1]<0) {   //si le missile dépasse le canvas, on supprime le missile
        m1[1]=yv;
        clearInterval(tm1);
        nbm=nbm-1;
        if (mlaser==1) {
            mlaser=0;   //mlaser=0 ne correspond à aucun missile. 
            help[13]=1;     
        }
    }
}
function mis2() {
    if (m2[1]<445) {
        ctx.clearRect(m2[0]+18,m2[1],2,10);
    }
    ecrit();
    ctx.beginPath();
    if (mlaser==2) {
        ctx.fillStyle="red";                                                //continuer lààààààààààà
    }
    ctx.fillRect(m2[0]+18,m2[1]-10,2,10);
    ctx.fillStyle="white";
    m2[1]=m2[1]-5;
    if (m2[1]<0) {
        m2[1]=yv;
        clearInterval(tm2);
        nbm=nbm-1;
        if (mlaser==2) {
            mlaser=0;
            help[13]=1;
        }
    }
}
function mis3() {
    if (m3[1]<445) {
        ctx.clearRect(m3[0]+18,m3[1],2,10);
    }
    ecrit();
    ctx.beginPath();
    if (mlaser==3) {
        ctx.fillStyle="red";                                                //continuer lààààààààààà
    }
    ctx.fillRect(m3[0]+18,m3[1]-10,2,10);
    ctx.fillStyle="white";
    m3[1]=m3[1]-5;
    if (m3[1]<0) {
        m3[1]=yv;
        clearInterval(tm3);
        nbm=nbm-1;
        if (mlaser==3) {
            mlaser=0;
            help[13]=1;
        }
    }
}
function stopmissile(mstop) {    //efface le missile qui a touché un monstre
    if (help[11]==3 && niveau==1 || mlaser==mstop) {    //s'il s'agit du niveau 1 et que on touche un monstre e40, rien ne se passe. Ou si le missile en question est le missile laser, rien ne se passe non plus
        help[13]==1;
    }
    else {
    switch (mstop) {
        case 1:
            clearInterval(tm1);
            m1[1]=450;
            break;
        case 2:
            clearInterval(tm2);
            m2[1]=450;
            break;
        case 3:
            clearInterval(tm3);
            m3[1]=450;
    }
    }
}
function vstop(){   //arrete le vaisseau
    clearInterval(tt);
    help[3]=1;
    if (help[5]==1) {
        help[5]=-1;
        tt2=setTimeout(vstop2,ttir);
    }
}
function vstop2(){
    help[5]=1;
    help[4]=1;
}
function evient(){  //place les monstres
    if (kill==(niveau*3)+2 || niveau==1 && kill>=3) {   //si on a tué tous les monstres
        Go();
        if (niveau==10) {
            finish();
        }
    }
    if (niveau<11) {    //permet de ne pas faire apparaitre les monstres si on a fini le jeu
    ctx.clearRect(0,0,400,450);
    ecrit();
    for (var w=1;w<=niveau+1;w=w+1) {   //place les monstres e10-voir feuille annexe
        if (niveau%2!=0) {
            xe1=200+help[8]*(Math.floor(w/2)*4+(Math.ceil((w-1)/2))*30)+2;    
            help[8]=-help[8];
        }
        else {
           if (w==1) {
            xe1=185;
           }
           else{
            if (w%2!=0) {
                xe1=200+help[9]*(Math.ceil((w-1)/2)*4+(w*15));
            }
            else{
                xe1=200+help[9]*(Math.ceil((w-1)/2)*4+((w-1)*15));
            }
           help[9]=-help[9];
           }
        }
        xe1=xe1+xeb;
        if (t10[w-1]==1) {
            if (help[16]%2!=0) {
                ctx.drawImage(e10,xe1,250+3*cote);
            }
            else{
                ctx.drawImage(e102,xe1,250+3*cote);
            }
        }
        t10[11+w-1]=xe1;    //prend la coordonée du monstre
        help[11]=1;
        tquoi=t10[w-1]; //si tquoi vaut -1, c'est qu'il 'y a pas de monstre à cet endroit, et donc que le missile peut passer outre
        test(xe1,250+3*cote,20,w,tquoi);
    }
    for (var w=1;w<=niveau;w=w+1) {     //place les monstres e20
        if (niveau%2==0) {
            xe2=200+help[8]*(Math.floor(w/2)*4+(Math.ceil((w-1)/2))*30)+2;
            help[8]=-help[8];
        }
        else {
           if (w==1) {
            xe2=185;
           }
           else{
            if (w%2!=0) {
                xe2=200+help[9]*(Math.ceil((w-1)/2)*4+(w*15));
            }
            else{
                xe2=200+help[9]*(Math.ceil((w-1)/2)*4+((w-1)*15));
            }
           help[9]=-help[9];
           }
        }
        xe2=xe2+xeb;
        if (t20[w-1]==1) {
            if (help[16]%2!=0) {
                ctx.drawImage(e20,xe2,200+3*cote);
            }
            else{
                ctx.drawImage(e202,xe2,200+3*cote);
            }
        }
        help[11]=2;
        t20[11+w-1]=xe2;
        tquoi=t20[w-1];
        test(xe2,200+3*cote,21,w,tquoi);
    }
    for (var w=1;w<=niveau+1;w=w+1) {   //place les monstres e40
        if (niveau%2!=0) {
            xe4=200+help[8]*(Math.floor(w/2)*4+(Math.ceil((w-1)/2))*30)+2;
            help[8]=-help[8];
        }
        else {
           if (w==1) {
            xe4=185;
           }
           else{
            if (w%2!=0) {
                xe4=200+help[9]*(Math.ceil((w-1)/2)*4+(w*15));
            }
            else{
                xe4=200+help[9]*(Math.ceil((w-1)/2)*4+((w-1)*15));
            }
           help[9]=-help[9];
           }
        }
        xe4=xe4+xeb;
        if (niveau>1 && t40[w-1]==1) {
            if (help[16]%2!=0) {
                ctx.drawImage(e40,xe4,130+3*cote);
            }
            else{
                ctx.drawImage(e402,xe4,130+3*cote);
            }
        }
        help[11]=3;
        t40[11+w-1]=xe4;
        tquoi=t40[w-1];
        test(xe4,130+3*cote,30,w,tquoi);
    }
    }
}
function test(xe,ye,hauteur,w2,tquoi2) {   //test si un des missiles du vaisseau a touché le monstre en question
    if (xe<=m1[0]+20 && xe+30>=m1[0]+18 && ye+hauteur>=m1[1]-10 && ye<=m1[1] && tquoi2==1) {
        test2(w2);  
        stopmissile(1);    //répertorie dans les () quel missile a touché le monstre afin de savoir que missile supprimer du canvas
    }
    if (xe<=m2[0]+20 && xe+30>=m2[0]+18 && ye+hauteur>=m2[1]-10 && ye<=m2[1] && tquoi2==1) {
        test2(w2);
        stopmissile(2);
    }
    if (xe<=m3[0]+20 && xe+30>=m3[0]+18 && ye+hauteur>=m3[1]-10 && ye<=m3[1] && tquoi2==1) {
        test2(w2);
        stopmissile(3);
    }
}
function test2(w3) {     //une fois le monstre touché, on arrive dans cette fonction, qui regarde de quel monstre il s'agit.
    switch (help[11]) {
        case 1:
            t10[w3-1]=-1;       //le tableau "de controle" des monstres e10 affiche -1 à l'emplacement correspondant au monstre tué
            score=score+100*difficulte;
            kill+=1;
            boome10.pause();    //arrête le son de l'explosion du vaisseau
            boome10.currentTime = 0;    //rembobinne la bande son de l'explosion du vaisseau
            boome10.play();             //fait jouer le son de l'explosion du vaisseau
            break;
        case 2:
            t20[w3-1]=-1;
            score=score+200*difficulte;
            kill+=1;
            boome20.pause();
            boome20.currentTime = 0;
            boome20.play();
            break
        case 3:
            if (niveau>1) {     //au niveau 1, les monstres e40 ne sont pas affichés
                kill+=1;
                t40[w3-1]=-1
                score=score+400*difficulte;
                boome40.pause();
                boome40.currentTime = 0;
                boome40.play();
            }
            break
    }
}
function edbouge() {    //crée un interval qui fera bouger les monstres
    teb=setInterval(ebouge,vx);
}
function ebouge(){      //fait bouger les monstres jusqu'à droite, puis jusqu'à gauche, et ainsi de suite
    controle(tbg.indexOf(exagauche),tbd.indexOf(exadroite),tbmg.indexOf(exagauche),tbmd.indexOf(exadroite));
    //appelle la fonction controle avec les arguments dont l'utilité est la suivante: Savoir à quel emplacement du tableau t10,t20 ou respectivement t40, il faudra voir si c'est égal à -1.
    help[18]=help[17];
    if (xeb<(160-((niveau-1)*17)+(exadroite*34)) && help[10]==1) {
        xeb=xeb+3;
        help[17]=1;
    }
    else {
        help[10]=-1
    }
    if (xeb>=((niveau-1)*17)-160-(exagauche*34) && help[10]==-1) {
        xeb=xeb-3;
        help[17]=-1;
    }
    else{
        help[10]=1;
    }
    if (help[18]!=help[17] && cote<56) {    //si les monstres ont changé de sens, le nombre de fois que les monstres ont "touché" les côtés augmente, les monstres seront ainsi placés plus bas
        cote+=1;
    }
    clearInterval(teb);
    vx=100-cote;
    teb=setInterval(ebouge,vx);
    evient();
}
function controle(ttbg,ttbd,ttbmg,ttbmd) {  //permet de savoir jusqu'où les monstres peuvent aller, de gauche à droite
    if (t10[ttbg]==-1 && t20[ttbmg]==-1 && t40[ttbg]==-1) {
        exagauche+=1; 
    }
    if (t10[ttbd]==-1 && t20[ttbmd]==-1 && t40[ttbd]==-1) {
        exadroite+=1;
}
}
function etire(){
    ran=Math.round(niveau*Math.random()+1)-1;   //prend un chiffre au hasard suivant le nombre de monstres e10 de/à chaque niveau
    ra14=tbg.indexOf(ran);  //controle quel monstre a été choisi, on connait désormais par quel "1" le monstre en question est représenté dans sa table de contrôle
    ra2=tbmd.indexOf(ran);  //même chose, mais pour les monstres du milieu
    if (t10[ra14]==1) {     //1) si le monstre est vivant, il tire
        emx=t10[ra14+11]+15;    //on prend la coordonnée x du monstre et la met dans la variable emx
        emy=250+3*cote+20;      //on calcule la coordonnée y du monstre en question et on la met dans la variable emy
        help[21]=-1;
    }
    else{
        if (t20[ra2]==1) {      //2) si non, celui d'au dessus de lui tire si ce dernier est vivant
            emx=t20[ra2+11]+15;
            emy=200+3*cote+21;
            help[21]=-1;
        }
        else{
            if (t40[ra14]==1 && niveau>1) {     //3) si non, celui d'au dessus de lui tire, si ce dernier n'a pas été détruit
                emx=t40[ra14+11]+15;
                emy=130+3*cote+30;
                help[21]=-1;
            }
            else{   //4) s'il a été détruit, on relance la fonction pour tenter de tirer avec un monstre existant
                etire();
            }
        }
    }
    if (help[21]==-1) { //si un monstre a été tué
        em.push(emx,emy,1); //on ajoute un missile ennemi dans le tableau qui leur est dédié -----on "sauvegarde" les coordonnées de départ du missile ennemi
        ems+=3;     
        help[21]=1;
        if (help[22]==1 && help[1]==-1) {   //si on a pas déjà créé l'interval etm
            etm=setInterval(emissile,vm/2);
            help[22]=-1;
            }
    } 
}
function emissile() {
    for (var k=2;k<em.length;k=k+3) {
        if (em[k]==1) {
        ctx.beginPath();
        ctx.arc(em[k-2],em[k-1],2,0,2*Math.PI);
        ctx.fill();
        em[k-1]=em[k-1]+1;
        if (em[k-1]>520) {
            em[k]=-1;
        }
        if (em[k-1]>yv-2) {  //si le missile est au niveau du vaisseau
             if (em[k-2]+2>=xv && em[k-1]+2>=yv && em[k-2]-2<=xv+38 && em[k-1]<=yv+38) {  //si le missile est au même endroit x et y que le vaisseau
                tcem(em[k-2]-xv,em[k-1]-yv);    //appelle la fonction tcem avec em[k-2]-xv, respectivement em[k-1]-yv, la position relative du missile ennemi par rapport au vaisseau
            }
        }
        ctx.clearRect(em[k-2]-2,em[k-1]-3,4,1);
        }
    } 
}
function tcem(eemx,eemy) {
    if (eemx>=0 && eemx<6) {   //controle si le missile touche une des 5 parties du vaisseau
        if (eemx+2>=0 && eemy+2>=19 && eemx-2<=5 && eemy-2<=38) {
            hit();
        }
    }
    else if (eemx>5 && eemx<18) {
        if (eemx+2>=6 && eemy+2>=10 && eemx-2<=17 && eemy-2<=38) {
            hit();
        }
    }
    else if (eemx>17 && eemx<22) {
        if (eemx+2>=18 && eemy+2>=0 && eemx-2<=21 && eemy-2<=38) {
            hit();
        }
    }
    else if (eemx>21 && eemx<34) {
        if (eemx+2>=22 && eemy+2>=10 && eemx-2<=33 && eemy-2<=38) {
            hit();
        }
    }
    else if (eemx>33 && eemx<39) {
        if (eemx+2>=34 && eemy+2>=19 && eemx-2<=38 && eemy-2<=38) {
            hit();
        }
    }
}
function hit() {
    explosion1audio.play();
    score=score-500;
    vie=vie-1;
    if (vie==0) {
        gameover();
    }
    else {
    ecrit();
    if (difficulte!=1) {
        help[16]=Math.ceil(help[16]%2)+1;   //réduit indirectement le nombre de missiles ennemis tirés par seconde en gardant l'emplacement des ailes
    }
    em=[];
    ctx.clearRect(0,0,400,500);
    xv=181;
    ctx.drawImage(vai,xv,yv);
    }
}
function Go() {
    if (niveau<10 || help[23]==-1) {
        help[10]=1;
        cote=0;
        help[17]=1;
        niveau=niveau+1;
        exagauche=0;
        exadroite=0;
        clearInterval(ta);
        em=[];
        ctx.clearRect(0,yv,400,500-yv);
        ctx.drawImage(vai,xv,yv);
        mouvementaile();
        help[16]=1;
        kill=0;
        tableaux();
        tab();
        xeb=0;
        if (help[23]==1) {
            levelup.play();
            ta=setInterval(mouvementaile,4000);
            evient();
        }
        else {
            help[23]=1;
        }
    }
}
function over() {
    callAPI(document.getElementById('name').value,score);  //leaderboard
    document.getElementById('Enter_user_name').style.visibility = "hidden";
    document.getElementById('name').style.visibility = "hidden";
    document.getElementById('leaderboard').style.visibility = "visible";
    
    score=0;
    $("pa").innerHTML="SELECT DIFFICULTY :<br><br> PRESS 1 FOR EASY - 2 FOR NORMAL - 3 FOR HARD - 4 FOR HARDCORE !";
    tab();  //réinitialise les tableaux de controle des monstres.
    help[0]=1;
    help[1]=1;  // on n'est plus en jeu, permet de ne plus pouvoir déplacer le vaisseau
    help[14]=1;
    help[24]=-1;   //ruse pour utiliser la fonction Go() sans appeler evient()
    help[22]=1;
    help[10]=1;     //Permet de faire que lorsqu'on recommence, les monstres repartent par à droite
    help[6]=1;  //permet de ne plus pouvoir déplacer le vaisseau
    help[7]=1;  //permet de ne plus pouvoir déplacer le vaisseau
    em=[];      //supprime le tableau des données des missiles; donc empeche d'autres missiles d'apparaitre dans le canvas
    xv=181; //coordonnée x du vaisseau
    m1[1]=yv;
    clearInterval(tm1);
    m2[1]=yv;
    clearInterval(tm2);
    m3[1]=yv;
    clearInterval(tm3);
    nbm=0;
    clearInterval(ta);
    clearInterval(ett);
    clearInterval(teb);
    clearInterval(etm);
    clearTimeout(ttlaser);
    clearTimeout(tt1laser);
    if (help[6]==1) {
        clearInterval(td);
    }
    if (help[7]==1) {
        clearInterval(tg);
    }
    clearInterval(tedb);
    ctx.clearRect(0,0,400,500);
}
function gameover() {
    over();
    gameoveraudio.play();
    ctx.drawImage(gameoverimg,43,0);
    ctx.font = " 12pt Minecraft";   //prend une police 
    ctx.fillStyle = "#fff";         //couleur blanche
    ctx.fillText("SCORE : "+score,150,337)
    ctx.fillText("INSERT COIN TO RESTART", 90, 397);

}
function finish() {
    niveau=11;    //permet de ne pas faire apparaître les monstres une fois la partie terminée
    over();
    endaudio.play();
    ctx.drawImage(youwin,0,0)
    ctx.font="13pt Minecraft";
    ctx.fillText("SCORE : "+score,138,310);
    ctx.fillText("INSERT COIN TO RESTART",80,450);

}
function restart1() {
    document.getElementById('Enter_user_name').style.visibility = "visible";
    document.getElementById('name').style.visibility = "visible";
    document.getElementById('leaderboard').style.visibility = "hidden";
    niveau=0;  //car le Go() ajoute un niveau
    vie=3;
    help[23]=-1;
    Go();
    clearInterval(ett);
}
var callAPI = (firstName,score_)=>{
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"name":firstName,"score":score_});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://0lf88vxf4g.execute-api.us-east-1.amazonaws.com/ldm-dev-website-stage", requestOptions)
    .then(response => response.text())
    .then(result => document.getElementById('leaderboard').innerHTML=("Leaderboard:"+JSON.parse(result).body))
    .catch(error => console.log('error', error));
}