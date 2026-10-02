# RehabAI model baseline

This folder trains and serves a research baseline from the real REHAB24-6 rehabilitation dataset. It recognizes the dataset's six exercise categories from a segmented 26-joint, 2D skeleton repetition:

| Dataset label | Exercise |
| --- | --- |
| Ex1 | Arm abduction |
| Ex2 | Arm V-to-W |
| Ex3 | Table push-up |
| Ex4 | Leg abduction |
| Ex5 | Leg lunge |
| Ex6 | Squat |

These classes are not the nine labels in the RehabAI presentation. This is a starter model trained on public data so the end-to-end ML workflow can be developed; it must not be presented as RehabAI's original model or as clinically validated. The data authors restrict use to academic or nonprofit, noncommercial research; review the [dataset record](https://zenodo.org/records/13305826) before use outside that scope.

## Data source and setup

The compressed, segmented 2D skeleton sequences and annotations come from the [ExerciseLLM dataset repository](https://github.com/jessicaxtang/ExerciseLLM), which identifies REHAB24-6 as its source. Its compact archive is about 27 MB. The source dataset record describes 1,072 repetitions from 10 people with exercise and correctness labels. Download the prepared archive:

```powershell
New-Item -ItemType Directory -Force data | Out-Null
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/jessicaxtang/ExerciseLLM/main/dataset/REHAB24-6/2d_joints_segmented.zip" `
  -OutFile "data/2d_joints_segmented.zip"
Expand-Archive -Force "data/2d_joints_segmented.zip" data
```

Create an isolated Python environment and train:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python train.py
```

Training uses five-fold, participant-separated evaluation, then refits the model on all available samples for the saved artifact. It writes the deployable `models/exercise_classifier.joblib` and the metrics `models/evaluation.json`.

## Run inference

```powershell
uvicorn app:app --host 127.0.0.1 --port 8001
```

`POST /predict` accepts a segmented sequence:

```json
{
  "jointSequence": [
    [[0.0, 0.0], [0.1, 0.2]],
    [[0.0, 0.1], [0.1, 0.3]]
  ]
}
```

The example is abbreviated; each frame must contain the dataset's 26 joints and two coordinates. The current backend evaluation route instead accepts 16 joint angles and the frontend does not yet capture camera pose. Adapting that contract and adding segmentation/pose extraction are follow-up integration work.

## Citation

Černek, A., Sedmidubsky, J., Budikova, P. (2024). *REHAB24-6: Physical Therapy Dataset for Analyzing Pose Estimation Methods*. SISAP 2024. DOI: [10.5281/zenodo.13305826](https://doi.org/10.5281/zenodo.13305826).
