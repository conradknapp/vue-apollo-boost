<template>
  <v-alert dark icon="warning" :color="error" dismissible @input="onClose" transition="scale-transition" :value="true">
    <h3 class="text-xs-center">{{text}}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ["text"],
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