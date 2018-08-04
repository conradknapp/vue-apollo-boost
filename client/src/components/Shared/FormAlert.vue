<template>
  <v-alert dark :color="color" dismissible @input="onClose" :class="{ 'hide' : hideAlert }" :value="true">
    <h3 class="text-xs-center">{{text}}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ["text", "color"],
  data() {
    return {
      hideAlert: false
    };
  },
  methods: {
    onClose() {
      this.hideAlert = !this.hideAlert;
      this.$emit("dismiss");
    }
  }
};
</script>

<style>
.hide {
  animation: hideAlert 1s forwards;
}
@keyframes hideAlert {
  0% {
    transform: translateX(-20%);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>