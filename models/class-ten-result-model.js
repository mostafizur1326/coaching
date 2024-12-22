const mongoose = require('mongoose');

const classTenResultSchema = new mongoose.Schema({
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
  physics: {
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
  chemistry: {
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
  biology: {
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
  higherMath: {
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
  class_ten_result: {
    type: String
  }
}, { timestamps: true });

classTenResultSchema.statics.getAllclassTenResults = function() {
  return this.find();
}

module.exports = mongoose.model('ClassTenResult', classTenResultSchema);