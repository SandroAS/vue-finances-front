<template>
  <div class="mt-8">
    <RecordsList/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import RecordsList from './../components/RecordsList.vue'

export default {
  name: 'RecordsHome',
  components: { RecordsList },
  created() {
    this.setTitle({ title: 'Lançamentos' })
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>
