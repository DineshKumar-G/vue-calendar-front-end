<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{mode}} Event</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Event Name">
        <b-input type="Event Name" v-model="newEventTitle" placeholder="Your Event Name" required></b-input>
      </b-field>
      <b-field label="Event Description">
        <textarea
          class="textarea"
          type="Event Description"
          v-model="newEventDesc"
          event
          Description-reveal
          placeholder="Your Event Description"
          required
        ></textarea>
      </b-field>
      <!-- <b-dropdown aria-role="list" v-model="newEventColor">-->
        <button
          class="button has-text-white has-text-weight-bold clr-btn"
          @click="isColorModalActive = !isColorModalActive"
        >Choose a Color!</button>
          <!--

        <b-dropdown-item aria-role="listitem" value="red">Red</b-dropdown-item>
        <b-dropdown-item aria-role="listitem" value="blue">Blue</b-dropdown-item>
        <b-dropdown-item aria-role="listitem" value="green">Green</b-dropdown-item>
      </b-dropdown> -->
      <b-modal :active.sync="isColorModalActive" has-modal-card>
        <color-picker v-model="newEventColor"></color-picker>
      </b-modal>
    </section>
    <footer class="modal-card-foot">
      <div class="columns is-fullwidth">
        <div class="column">
          <button class="button is-danger" type="button" @click="cancel()">Cancel</button>
        </div>

        <div class="column">
          <button
            class="button is-danger"
            type="button"
            @click="remove()"
            v-if="mode === 'Edit'"
          >Delete</button>
        </div>
         <div class="column">
          <button class="button is-success" v-bind:class="{'save-btn': mode === 'Add'}" @click="save()">Save</button>
        </div>
      </div>
    </footer>
  </div>
</template>


<script>
import ColorPicker from 'vue-color-picker-wheel';
import uuid from "uuid/v4";
import _ from "lodash";

export default {
  name: "MoveModal",
  components: {
    ColorPicker
  },
  props: ["arg", "mode", "calendar"],
  data() {
    return {
      newEventTitle: "",
      newEventDesc: "",
      newEventColor: "",
      isColorModalActive: false,
    };
  },
  methods: {
    save() {
      const objToPass = {
        id: this.mode === "Add" ? uuid() : this.arg.event.id,
        title: this.newEventTitle,
        extendedProps: {
          desc: this.newEventDesc
        },
        start: this.mode === "Add" ? this.arg.date : this.arg.event.start,
        allDay: true,
        color: this.newEventColor,
        borderColor: "black"
      };
      this.$emit("save", objToPass);
      this.cancel();
    },
    cancel() {
      this.newEventTitle = "";
      this.newEventDesc = "";
      this.$emit("close");
    },
    remove() {
      this.$emit("remove", this.arg.event.id);
      this.cancel();
    }
  },
  created() {
    if (this.mode === "Edit") {
      this.newEventTitle = this.arg.event.title;
      this.newEventDesc = this.arg.event.extendedProps.desc;
      this.newEventColor = this.arg.event.backgroundColor;
    }
  }
};
</script>

<style>
.modal-card {
  height: 120% !important;
}
.modal-card-foot {
  background-color: $table-detail-row-striped-background-color;
  justify-content: flex-end;
  .button {
    min-width: 150px;
  }
}
.modal-card-foot {
  padding-left: 25% !important;
}
.save-btn {
  left: 150%;
}
.clr-btn{
height: 50px;
background: #ff3232;
background: -moz-linear-gradient(-45deg, #ff3232 0%, #ff3030 50%, #282fff 51%, #005dff 100%);
background: -webkit-linear-gradient(-45deg, #ff3232 0%,#ff3030 50%,#282fff 51%,#005dff 100%);
background: linear-gradient(135deg, #ff3232 0%,#ff3030 50%,#282fff 51%,#005dff 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff3232', endColorstr='#005dff',GradientType=1 );
}
</style>