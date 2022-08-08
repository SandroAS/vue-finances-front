<template>
  <v-card :color="color" class="mr-2">
    <div style="height: 340px"></div>
  </v-card>
</template>

<script>
export default {
  name: 'NumericDisplay',
  props: {
    color: {
      required: true,
      type: String,
      default: 'primary'
    }
  }
}
</script>
