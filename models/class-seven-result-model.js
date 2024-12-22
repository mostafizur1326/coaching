const mongoose = require('mongoose');

const classSevenResultSchema = new mongoose.Schema({
  name: {
    type: String
  },
  className: {
    type: String
  },
  roll: {
    type: String,
    unique: true,
    required: true
  },
  banglaFirstPaper: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  banglaSecondPaper: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  englishFirstPaper: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  englishSecondPaper: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  math: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  science: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  ict: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  religion: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  bgs: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: Number,
      default: 0
    }
  },
  agriculture: {
    cq: {
      type: Number,
      default: 0
    },
    mcq: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    gpa: {
      type: String,
      default: 0
    }
  },
  finalGPA: {
    type: String,
    default: 0
  },
  class_seven_result: {
    type: String
  }
}, { timestamps: true });

classSevenResultSchema.statics.getAllclassSevenResults = function() {
  return this.find();
}

module.exports = mongoose.model('ClassSevenResult', classSevenResultSchema);