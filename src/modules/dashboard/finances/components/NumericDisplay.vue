<template>
  <v-card :color="color" class="mr-2">

    <v-card-title>
      <v-spacer></v-spacer>
      <h3 class="display-2 font-weight-light pt-3 mb-5">{{ display }}</h3>
    </v-card-title>

    <v-card-text>
      <v-layout row wrap justify-end pb-6>
        <v-flex
          v-for="btn in buttons"
          :key="btn"
          xs4
          px-1 pt-2 pb-2
        >
          <v-btn
            :color="color"
            class="headline"
            @click="change(btn, 'add')"
          >
            {{ btn }}
          </v-btn>
        </v-flex>
        <v-flex
          xs4
          px-1 pt-2 pb-2
        >
          <v-btn icon @click="change">
            <v-icon>backspace</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>

  </v-card>
</template>

<script>
import formatCurrencyMixin from '@/mixins/format-currency'

export default {
  name: 'NumericDisplay',
  mixins: [
    formatCurrencyMixin
  ],
  props: {
    color: {
      required: true,
      type: String,
      default: 'primary'
    },
    value: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data: () => ({
    buttons: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
  }),
  computed: {
    display() {
      return this.formatCurrency(this.value || 0)
    }
  },
  methods: {
    change(btnValue, operation) {
      const currentValue = this.value.toFixed(2)
      const total = operation === 'add' ? (+(currentValue + btnValue) * 10) : (+currentValue.slice(0, -1) / 10)
      this.$emit('input', total)
    }
  }
}
</script>
