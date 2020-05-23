
<template>
  <div class="demo-app">
    <div class="buttons">
      <b-button class ="save" type="is-success" @click="pushToStore">Save!</b-button>
    </div>
    <FullCalendar
      class="demo-app-calendar"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :customButtons="{
         myCustomButton: {
          text: 'Check custom button prop!',
          click: function() {
            alert('clicked the custom button!');
          }
        }
      }"
      :header="{
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }"
      :editable='true'
      :plugins="calendarPlugins"
      :weekends="calendarWeekends"
      :events="calendarEvents"
      eventLimit="{eventLimit: true}"
      @dateClick="handleDateClick"
      @eventClick="eventClicked"
      @eventDragStart="dragStart"
      @eventDrop ="dragDrop"
    />
    <b-modal :active.sync="isComponentModalActive" :canCancel="false" has-modal-card>
      <modal-form @close="isComponentModalActive = false" @save="eventCreate" :arg="argToCreate" :mode="purpose" @remove="removeEvent"></modal-form>
    </b-modal>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalForm from "./CreateModal";
import uuid from 'uuid/v4';
// import _ from 'lodash';
// import buefy from 'buefy';
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    ModalForm
  },
  // mixins: [Mixin],
  data() {
    return {
      calendar: {},
      isComponentModalActive: false,
      purpose: 'Add',
      argToCreate: {},
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: []
    };
  },
  methods: {
    pushToStore() {
      const tEvents = this.calendar.getEvents();
      const arrToCommit = [];
      for(const event of tEvents){
        const objToCommit = {
          title: event.title,
          start: event.start,
          color: event.backgroundColor,
          id: event.id,
          textColor: event.textColor,
          borderColor: event.borderColor,
          desc: event.extendedProps.desc
        }
        arrToCommit.push(objToCommit)
      }
      this.$store.commit('events', arrToCommit);
    },
    removeEvent(id){
      let eventToRemove = this.calendar.getEventById( id )
      eventToRemove.remove()
    },
    eventCreate(infoObj) {
      if(this.purpose === 'Edit') { 
      let totatEvent = [];
      totatEvent.push(this.calendar.getEvents());
        totatEvent[0].forEach(element => {
          if(element.id === infoObj.id){
            let eventToEdit = this.calendar.getEventById( infoObj.id )
            eventToEdit.setProp('title', infoObj.title)
            eventToEdit.setProp('backgroundColor', infoObj.color)
            eventToEdit.setExtendedProp('desc', infoObj.extendedProps.desc)
          }
        });
      }
      else this.calendarEvents.push(infoObj);
    },
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends; // update a property
    },
    gotoPast() {
      const calendarApi = this.$refs.fullCalendar.getApi(); // from the ref="..."
      calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    },
    handleDateClick(arg) {
      this.purpose = 'Add';
      this.argToCreate = arg;
      this.isComponentModalActive = true;
    },
    eventClicked(ev) {
      this.purpose = 'Edit';
      this.argToCreate = ev
      this.isComponentModalActive = true;
    },
    dragStart(ev){
      console.log('Drag STARTED!!', ev)
    },
    dragDrop(ev){
      console.log('Drag Stopped!!', ev)
    }
  },
  async created() {
    await this.$nextTick();
    this.calendar = this.$refs.fullCalendar.getApi();
    // // calendar.setOption('contentHeight', 600);
    this.calendar.setOption("height", 1000);
    // // calendar.setOption('width', 100);
    // // calendar.setOption('aspectRatio', 1.1);
    // var ratio = calendar.getOption('aspectRatio');
    const existingEvents = this.$store.state.events;
    if(existingEvents.length){
      for (let i = 0; i < existingEvents.length; i++) {
        existingEvents[i].allDay= true,
        this.calendar.addEvent(existingEvents[i]);
      } 
    }
    else{
      let date = new Date();
      for (let i = 1; i < 3; i++) {
        date.setDate(date.getDate() + -i);
        this.calendar.addEvent({
          id: uuid(),
          title:'Example Event'+ i ,
          extendedProps: {
            desc:'This is a sample description, You can have events with title and descripitions, you can drag and drop them to different dates and you can edit the meta data they contain! suggestions are welcome!',
          },
          start: date,
          allDay: true,
          // color: 'yellow',
          textColor: 'white',
          borderColor: 'black',
        });
      } 
    }
  }
};
</script>

<style lang='scss'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
@import "~bulma/bulma";
@import "~buefy/dist/buefy.css";

.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-top {
  margin: 0 0 3em;
}

.demo-app-calendar {
  margin: 0 auto;
}
.fc-content {
  height: 30px;
}
.fc-title {
  font-size: 22px;
  text-decoration: underline;
}
.fc-day-number {
  font-size: 20px;
}
.save {
  position: absolute;
  right: 20%;
  top: 4%;
}
  @media only screen and (min-device-width: 480px) 
                     and (max-device-width: 640px) 
                     and (orientation: landscape) {
   .save {
    top: -10px;
  }
  }
</style>
