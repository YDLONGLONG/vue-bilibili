<template>
  <div class="body">
    <div class="container">
        <div><img src="../assets/img/1.png" alt=""></div>
        <div><img src="../assets/img/2.png" alt=""></div>
        <div><img src="../assets/img/3.png" alt=""></div>
        <div><img src="../assets/img/4.png" alt=""></div>
        <div><img src="../assets/img/5.png" alt=""></div>
        <div><img src="../assets/img/6.png" alt=""></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted(){
    const container = document.querySelector('.container')
    const imgs = document.querySelectorAll('.container img')
    container.addEventListener('mousemove',function(e){
    let percent = e.clientX/window.outerHeight;
    let offset = 10*percent;
    let blur = 20;
    imgs.forEach((img,index)=>{
        offset*=1.3;
        let blurValue = Math.pow(index/imgs.length-percent,2)*blur;
        img.style.setProperty('--offset',offset+'px')
        img.style.setProperty('--blur',blurValue+'px')
        })
    })
    //鼠标移出container恢复原状
    container.addEventListener('mouseleave',function(){
        imgs.forEach((img,index)=>{
            img.style.setProperty('--offset',0+'px')
            img.style.setProperty('--blur',0+'px')
        })
    })
  }
}
</script>
<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
}
// .body{
//     height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
// }
.container{
    width: 100%;
    height: 180px;
    position: relative;
    overflow: hidden;
}
.container div{
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
}
.container div img{
    width: 110%;
    height: 100%;
    object-fit: cover;
    --offset:0px;
    --blur:2px;
    transform: translateX(var(--offset));
    filter: blur(var(--blur));
}
</style>
