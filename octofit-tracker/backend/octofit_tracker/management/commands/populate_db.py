from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from django.conf import settings
from pymongo import MongoClient
from datetime import timedelta, date
from bson import ObjectId
import random

class Command(BaseCommand):
    help = 'Populate the database with test data for users, teams, activity, leaderboard, and workouts'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        db_config = settings.DATABASES['default']
        client_config = db_config.get('CLIENT', {})
        host = client_config.get('host', 'localhost')
        port = client_config.get('port', 27017)
        username = client_config.get('username', None)
        password = client_config.get('password', None)
        auth_source = client_config.get('authSource', 'admin')
        
        if username and password:
            client = MongoClient(host=host, 
                                port=port, 
                                username=username, 
                                password=password, 
                                authSource=auth_source)
        else:
            client = MongoClient(host=host, port=port)
        
        db = client[db_config['NAME']]

        # Drop existing collections
        db.users.drop()
        db.teams.drop()
        db.activity.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Create users
        users = [
            User(_id=ObjectId(), username='thundergod', email='thundergod@mhigh.edu', password='thundergodpassword'),
            User(_id=ObjectId(), username='metalgeek', email='metalgeek@mhigh.edu', password='metalgeekpassword'),
            User(_id=ObjectId(), username='zerocool', email='zerocool@mhigh.edu', password='zerocoolpassword'),
            User(_id=ObjectId(), username='crashoverride', email='crashoverride@hmhigh.edu', password='crashoverridepassword'),
            User(_id=ObjectId(), username='sleeptoken', email='sleeptoken@mhigh.edu', password='sleeptokenpassword'),
        ]
        User.objects.bulk_create(users)

        # Create teams
        team = Team(_id=ObjectId(), name='Blue Team')
        team.save()
        for user in users:
            team.members.add(user)

        # Create activities with realistic dates
        today = date.today()
        activities = []
        
        # Activity types
        activity_types = ['Cycling', 'Running', 'Swimming', 'Strength', 'Crossfit', 'Yoga', 'Basketball', 'Tennis']
        
        # Create 30 activities with random dates in the past 14 days
        for _ in range(30):
            random_user = random.choice(users)
            random_activity_type = random.choice(activity_types)
            
            # Random duration between 30 minutes and 3 hours
            hours = random.randint(0, 2)
            minutes = random.randint(1, 59) if hours == 0 else random.randint(0, 59)
            duration = timedelta(hours=hours, minutes=minutes)
            
            # Random date in the past 14 days
            days_ago = random.randint(0, 13)
            activity_date = today - timedelta(days=days_ago)
            
            # Create the activity with the random values
            activities.append(
                Activity(
                    _id=ObjectId(),
                    user=random_user,
                    activity_type=random_activity_type,
                    duration=duration,
                    date=activity_date
                )
            )
        
        Activity.objects.bulk_create(activities)

        # Create leaderboard entries
        leaderboard_entries = [
            Leaderboard(_id=ObjectId(), user=users[0], score=100),
            Leaderboard(_id=ObjectId(), user=users[1], score=90),
            Leaderboard(_id=ObjectId(), user=users[2], score=95),
            Leaderboard(_id=ObjectId(), user=users[3], score=85),
            Leaderboard(_id=ObjectId(), user=users[4], score=80),
        ]
        Leaderboard.objects.bulk_create(leaderboard_entries)

        # Create workouts
        workouts = [
            Workout(_id=ObjectId(), name='Cycling Training', description='Training for a road cycling event'),
            Workout(_id=ObjectId(), name='Crossfit', description='Training for a crossfit competition'),
            Workout(_id=ObjectId(), name='Running Training', description='Training for a marathon'),
            Workout(_id=ObjectId(), name='Strength Training', description='Training for strength'),
            Workout(_id=ObjectId(), name='Swimming Training', description='Training for a swimming competition'),
            Workout(_id=ObjectId(), name='Yoga Flow', description='Flexibility and mindfulness training'),
            Workout(_id=ObjectId(), name='Basketball Drills', description='Basketball skill development'),
            Workout(_id=ObjectId(), name='Tennis Practice', description='Tennis skill improvement routine'),
        ]
        Workout.objects.bulk_create(workouts)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with test data.'))