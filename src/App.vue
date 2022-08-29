<template>
  <div id="app">
    <!-- <transition
    enter-active-class="animated bounceInLeft"
    > -->
      <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
:root{
  --main-color:white;
  --main-color2:#F5F7FB;
  --main-color3:#E6EBF5;
  --font-color:white;
  /* #A6B0CF */
  --font-color1:#807F9A;
  --font-color2:#495057;
  --theme-color:#F3ECFF;
  --theme-color2:#7269EF;
  
}
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
ul,li{
  list-style: none;
}
html{
  height: 100%;
}
body{
  background-color: #F1F1F1;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
#app{
  height: 100%;
  /* 解决外边距重叠 */
  overflow: hidden;
}
</style>
