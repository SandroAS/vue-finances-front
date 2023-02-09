<template>
  <v-toolbar :color="color">
    <v-layout align-center>

      <v-flex xs1>
        <div class="text-left">
          <v-btn icon @click="decrement">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex xs8 offset-xs1>
        <v-toolbar-title class="text-center">
          <span>{{ upperCaseFirstLetter(currentMonth) }}</span>
        </v-toolbar-title>
      </v-flex>

      <v-flex v-if="showSlot" xs1 text-xs-right>
        <slot />
      </v-flex>

      <v-flex xs1 :class="arrowRightClass">
        <div class="text-right">
          <v-btn icon @click="increment">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </div>
      </v-flex>

    </v-layout>
  </v-toolbar>
</template>

<script>
import moment from 'moment'
import upperCaseFirstLetter from '@/mixins/uppercase-first-letter'

export default {
  name: 'ToolbarByMonth',
  mixins: [upperCaseFirstLetter],
  props: {
    color: {
      required: true,
      type: String,
      default: 'primary'
    },
    format: {
      required: true,
      type: String,
      default: 'MM-YYYY'
    },
    month: {
      required: true,
      type: String,
      default: ''
    },
    showSlot: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: undefined
  }),
  computed: {
    arrowRightClass() {
      return !this.showSlot ? 'offset-xs1' : ''
    },
    currentMonth() {
      return this.date.format('MMMM YYYY')
    }
  },
  created() {
    this.setCurrentMonth()
    this.emit()
  },
  methods: {
    emit() {
      this.$emit('month', this.date.format(this.format))
    },
    decrement() {
      this.date = this.date.clone().subtract(1, 'month')
      this.emit()
    },
    increment() {
      this.date = this.date.clone().add(1, 'month')
      this.emit()
    },
    setCurrentMonth() {
      this.date = this.month ? moment(this.month, this.format) : moment()
    }
  }
}
</script>
